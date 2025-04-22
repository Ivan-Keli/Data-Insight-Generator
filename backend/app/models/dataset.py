from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union

class ColumnStat(BaseModel):
    """
    Statistics for a dataset column.
    """
    data_type: str = Field(..., description="Data type of the column")
    count: int = Field(..., description="Number of non-null values")
    null_count: int = Field(..., description="Number of null values")
    unique_count: Optional[int] = Field(None, description="Number of unique values")
    min_value: Optional[Any] = Field(None, description="Minimum value (for numeric columns)")
    max_value: Optional[Any] = Field(None, description="Maximum value (for numeric columns)")
    mean: Optional[float] = Field(None, description="Mean value (for numeric columns)")
    median: Optional[float] = Field(None, description="Median value (for numeric columns)")
    std_dev: Optional[float] = Field(None, description="Standard deviation (for numeric columns)")
    most_common: Optional[List[Dict[str, Any]]] = Field(None, description="Most common values (for categorical columns)")
    
    class Config:
        schema_extra = {
            "example": {
                "data_type": "float64",
                "count": 1000,
                "null_count": 5,
                "unique_count": 243,
                "min_value": 10.5,
                "max_value": 999.99,
                "mean": 342.75,
                "median": 305.25,
                "std_dev": 155.32,
                "most_common": None
            }
        }

class DatasetPreview(BaseModel):
    """
    Preview of a dataset, including column information and sample rows.
    """
    columns: List[str] = Field(..., description="List of column names")
    preview_rows: List[Dict[str, Any]] = Field(..., description="Sample rows from the dataset")
    column_stats: Dict[str, ColumnStat] = Field(..., description="Statistics for each column")
    total_rows: int = Field(..., description="Total number of rows in the dataset")
    
    class Config:
        schema_extra = {
            "example": {
                "columns": ["id", "name", "price", "quantity"],
                "preview_rows": [
                    {"id": 1, "name": "Product A", "price": 19.99, "quantity": 100},
                    {"id": 2, "name": "Product B", "price": 29.99, "quantity": 50}
                ],
                "column_stats": {
                    "price": {
                        "data_type": "float64",
                        "count": 1000,
                        "null_count": 0,
                        "unique_count": 243,
                        "min_value": 10.5,
                        "max_value": 999.99,
                        "mean": 342.75,
                        "median": 305.25,
                        "std_dev": 155.32,
                        "most_common": None
                    }
                },
                "total_rows": 1000
            }
        }

class DatasetResponse(BaseModel):
    """
    Response model for dataset operations.
    """
    dataset_id: str = Field(..., description="Unique identifier for the dataset")
    name: str = Field(..., description="Dataset name")
    file_type: str = Field(..., description="File type (csv, xlsx, json)")
    columns: List[str] = Field(..., description="List of column names")
    row_count: int = Field(..., description="Total number of rows")
    preview: DatasetPreview = Field(..., description="Preview data")
    
    class Config:
        schema_extra = {
            "example": {
                "dataset_id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "sales_data.csv",
                "file_type": "csv",
                "columns": ["id", "name", "price", "quantity"],
                "row_count": 1000,
                "preview": {
                    "columns": ["id", "name", "price", "quantity"],
                    "preview_rows": [
                        {"id": 1, "name": "Product A", "price": 19.99, "quantity": 100},
                        {"id": 2, "name": "Product B", "price": 29.99, "quantity": 50}
                    ],
                    "column_stats": {
                        "price": {
                            "data_type": "float64",
                            "count": 1000,
                            "null_count": 0,
                            "unique_count": 243,
                            "min_value": 10.5,
                            "max_value": 999.99,
                            "mean": 342.75,
                            "median": 305.25,
                            "std_dev": 155.32,
                            "most_common": None
                        }
                    },
                    "total_rows": 1000
                }
            }
        }
        