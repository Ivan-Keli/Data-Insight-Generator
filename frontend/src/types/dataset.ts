/**
 * Statistics for a dataset column.
 */
export interface ColumnStat {
    data_type: string;
    count: number;
    null_count: number;
    unique_count?: number;
    min_value?: number;
    max_value?: number;
    mean?: number;
    median?: number;
    std_dev?: number;
    most_common?: { value: string; count: number }[];
  }
  
  /**
   * Preview of a dataset, including column information and sample rows.
   */
  export interface DatasetPreview {
    columns: string[];
    preview_rows: Record<string, any>[];
    column_stats: Record<string, ColumnStat>;
    total_rows: number;
  }
  
  /**
   * Dataset information and metadata.
   */
  export interface DatasetInfo {
    dataset_id: string;
    name: string;
    file_type: string;
    columns: string[];
    row_count: number;
    preview: DatasetPreview;
  }
  
  /**
   * Options for dataset filter or sorting.
   */
  export interface DatasetFilterOptions {
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filterColumn?: string;
    filterValue?: string;
  }
  
  /**
   * Dataset column metadata for enhanced display.
   */
  export interface ColumnMetadata {
    name: string;
    displayName: string;
    description?: string;
    dataType: string;
    isNumeric: boolean;
    format?: string;
  }
