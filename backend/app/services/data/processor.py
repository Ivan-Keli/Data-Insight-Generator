import pandas as pd
import numpy as np
import json
import logging
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Union
import traceback

from app.models.dataset import DatasetPreview, ColumnStat

logger = logging.getLogger(__name__)

class DatasetProcessor:
    """
    Service for processing and analyzing datasets.
    """
    
    def __init__(self):
        """
        Initialize the dataset processor.
        """
        self.supported_extensions = ['.csv', '.xlsx', '.xls', '.json']
        
    def process_dataset(self, file_path: str) -> DatasetPreview:
        """
        Process a dataset file and return preview information.
        
        Args:
            file_path: Path to the dataset file
            
        Returns:
            DatasetPreview: Preview information about the dataset
            
        Raises:
            Exception: If there's an error processing the dataset
        """
        try:
            # Read the dataset based on file extension
            df = self._read_file(file_path)
            
            # Generate preview
            return self._generate_preview(df)
            
        except Exception as e:
            logger.error(f"Error processing dataset: {str(e)}", exc_info=True)
            raise Exception(f"Failed to process dataset: {str(e)}")
    
    def get_dataset_context(self, dataset_id: str) -> Dict[str, Any]:
        """
        Get context information about a dataset for use in LLM prompts.
        
        Args:
            dataset_id: ID of the dataset
            
        Returns:
            Dict with dataset context information
            
        Raises:
            Exception: If dataset is not found or can't be processed
        """
        from app.api.routes.datasets import datasets  # Avoid circular imports
        
        if dataset_id not in datasets:
            raise Exception(f"Dataset with ID {dataset_id} not found")
        
        dataset = datasets[dataset_id]
        file_path = dataset["file_path"]
        
        if not os.path.exists(file_path):
            raise Exception(f"Dataset file no longer exists: {file_path}")
        
        # Read a sample of the dataset for analysis
        df = self._read_file(file_path, sample=True)
        
        # Create context dictionary
        context = {
            "name": dataset["name"],
            "original_filename": dataset["original_filename"],
            "file_type": dataset["file_type"],
            "rows": dataset["row_count"],
            "columns": [],
            "missing_values": {},
            "unique_values": {},
        }
        
        # Add column information
        for column in df.columns:
            col_info = {
                "name": column,
                "type": str(df[column].dtype),
                "example_values": df[column].dropna().head(3).tolist(),
            }
            
            # Add stats if available
            if column in dataset["stats"]:
                stats = dataset["stats"][column]
                
                if stats.min_value is not None:
                    col_info["min"] = stats.min_value
                
                if stats.max_value is not None:
                    col_info["max"] = stats.max_value
                
                if stats.mean is not None:
                    col_info["mean"] = stats.mean
                
                if stats.std_dev is not None:
                    col_info["std_dev"] = stats.std_dev
                
                if stats.null_count > 0:
                    context["missing_values"][column] = {
                        "count": stats.null_count,
                        "percentage": (stats.null_count / (stats.count + stats.null_count)) * 100
                    }
                
                if stats.unique_count is not None:
                    context["unique_values"][column] = stats.unique_count
            
            context["columns"].append(col_info)
        
        return context
    
    def _read_file(self, file_path: str, sample: bool = False) -> pd.DataFrame:
        """
        Read a dataset file into a pandas DataFrame.
        
        Args:
            file_path: Path to the dataset file
            sample: If True, read only a sample of the data
            
        Returns:
            pandas DataFrame with the dataset
            
        Raises:
            Exception: If the file can't be read
        """
        file_extension = Path(file_path).suffix.lower()
        
        if file_extension not in self.supported_extensions:
            raise Exception(f"Unsupported file type: {file_extension}")
        
        try:
            if file_extension == '.csv':
                if sample:
                    # Try to detect encoding and delimiter
                    return pd.read_csv(
                        file_path,
                        nrows=1000,  # Sample first 1000 rows
                        encoding='utf-8',  # Start with UTF-8
                        on_bad_lines='skip',
                        low_memory=False
                    )
                else:
                    return pd.read_csv(
                        file_path,
                        encoding='utf-8',
                        on_bad_lines='skip',
                        low_memory=False
                    )
            
            elif file_extension in ['.xlsx', '.xls']:
                if sample:
                    return pd.read_excel(file_path, nrows=1000)
                else:
                    return pd.read_excel(file_path)
            
            elif file_extension == '.json':
                # For JSON, read the whole file but limit rows after parsing
                df = pd.read_json(file_path)
                if sample:
                    return df.head(1000)
                return df
            
        except UnicodeDecodeError:
            # Try with different encoding if UTF-8 fails
            if file_extension == '.csv':
                return pd.read_csv(
                    file_path,
                    encoding='latin1',
                    nrows=1000 if sample else None,
                    on_bad_lines='skip',
                    low_memory=False
                )
            else:
                raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {str(e)}", exc_info=True)
            raise Exception(f"Failed to read file: {str(e)}")
    
    def _generate_preview(self, df: pd.DataFrame) -> DatasetPreview:
        """
        Generate preview information from a DataFrame.
        
        Args:
            df: pandas DataFrame to analyze
            
        Returns:
            DatasetPreview with information about the dataset
        """
        # Get basic information
        columns = df.columns.tolist()
        total_rows = len(df)
        
        # Get sample rows (first 10 rows as dictionaries)
        preview_rows = []
        for _, row in df.head(10).iterrows():
            # Convert row to dict, handling NaN values
            row_dict = {}
            for col in columns:
                value = row[col]
                if pd.isna(value):
                    row_dict[col] = None
                elif isinstance(value, np.integer):
                    row_dict[col] = int(value)
                elif isinstance(value, np.floating):
                    row_dict[col] = float(value)
                elif isinstance(value, np.bool_):
                    row_dict[col] = bool(value)
                else:
                    row_dict[col] = str(value)
            preview_rows.append(row_dict)
        
        # Generate column statistics
        column_stats = {}
        for column in columns:
            try:
                # Get data type
                dtype = df[column].dtype
                data_type = str(dtype)
                
                # Count non-null and null values
                count = df[column].count()
                null_count = df[column].isna().sum()
                
                # Create base stats
                stats = {
                    "data_type": data_type,
                    "count": int(count),
                    "null_count": int(null_count),
                }
                
                # Add unique count for all columns
                stats["unique_count"] = int(df[column].nunique())
                
                # Add numeric stats for numeric columns
                if np.issubdtype(dtype, np.number):
                    numeric_series = df[column].dropna()
                    if len(numeric_series) > 0:
                        stats["min_value"] = float(numeric_series.min())
                        stats["max_value"] = float(numeric_series.max())
                        stats["mean"] = float(numeric_series.mean())
                        stats["median"] = float(numeric_series.median())
                        stats["std_dev"] = float(numeric_series.std())
                
                # Add most common values for categorical columns (strings, booleans, categories)
                elif dtype == 'object' or dtype == 'bool' or pd.api.types.is_categorical_dtype(dtype):
                    # Get the 5 most common values with their counts
                    value_counts = df[column].value_counts().head(5).reset_index()
                    if not value_counts.empty:
                        most_common = []
                        for _, row in value_counts.iterrows():
                            most_common.append({
                                "value": str(row["index"]),
                                "count": int(row[column])
                            })
                        stats["most_common"] = most_common
                
                # Add to column stats
                column_stats[column] = ColumnStat(**stats)
                
            except Exception as e:
                logger.warning(f"Error generating stats for column {column}: {str(e)}")
                # Add basic info even if detailed stats fail
                column_stats[column] = ColumnStat(
                    data_type=str(df[column].dtype),
                    count=int(df[column].count()),
                    null_count=int(df[column].isna().sum()),
                    unique_count=None
                )
        
        # Create and return the preview
        return DatasetPreview(
            columns=columns,
            preview_rows=preview_rows,
            column_stats=column_stats,
            total_rows=total_rows
        )
        