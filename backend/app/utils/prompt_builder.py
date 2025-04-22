import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def build_prompt(
    query: str,
    dataset_context: Optional[Dict[str, Any]] = None,
    query_type: Optional[str] = None
) -> str:
    """
    Build a prompt for the LLM based on the query and dataset context.
    
    Args:
        query: The user's question
        dataset_context: Optional context about the dataset
        query_type: Optional type of query to help format the prompt
        
    Returns:
        Formatted prompt string for the LLM
    """
    # Determine the appropriate system instruction based on query type
    system_instruction = _get_system_instruction(query_type)
    
    # Format dataset context if available
    dataset_section = ""
    if dataset_context:
        dataset_section = _format_dataset_context(dataset_context)
    
    # Add response format instructions
    format_instructions = _get_format_instructions(query_type)
    
    # Combine all sections into the final prompt
    prompt = f"{system_instruction}\n\n"
    
    if dataset_section:
        prompt += f"{dataset_section}\n\n"
    
    prompt += f"USER QUESTION:\n{query}\n\n"
    prompt += format_instructions
    
    return prompt

def _get_system_instruction(query_type: Optional[str] = None) -> str:
    """
    Get the appropriate system instruction based on query type.
    
    Args:
        query_type: Type of query
        
    Returns:
        System instruction string
    """
    # Default general analysis instruction
    general_instruction = """
You are a data analysis assistant helping a user understand their dataset. 
Provide clear, concise, and accurate information based on the dataset details provided.
Focus on being educational and actionable with your responses.
When suggesting visualizations or analyses, provide specific Python code examples using pandas, matplotlib, or seaborn.
"""
    
    # Specific instructions based on query type
    if not query_type:
        return general_instruction
    
    query_type_instructions = {
        "correlation": """
You are a data analysis assistant focusing on correlation analysis.
Analyze the potential correlations between variables in the dataset.
Provide correlation coefficients and visualization code to illustrate relationships.
Explain the strength and direction of correlations, and whether they indicate causation.
""",
        "data_quality": """
You are a data quality assessment specialist.
Analyze the data quality issues in the dataset.
Identify potential problems like missing values, outliers, or inconsistencies.
Suggest approaches to handle these issues with specific code examples.
""",
        "visualization": """
You are a data visualization specialist.
Based on the dataset information provided, recommend the most appropriate visualization approach.
Include specific code examples using matplotlib, seaborn, or plotly.
Explain why your recommended visualization is appropriate for this particular data structure.
""",
        "feature_engineering": """
You are a feature engineering expert.
Suggest potential feature engineering approaches for this dataset.
Provide specific code examples for implementing these features.
Explain how these new features might improve analysis or model performance.
""",
        "predictive_modeling": """
You are a predictive modeling specialist.
Recommend appropriate predictive modeling approaches for this dataset.
Explain why these approaches are suitable and provide starter code for implementing them.
Discuss potential evaluation metrics and validation strategies.
"""
    }
    
    return query_type_instructions.get(query_type, general_instruction)

def _format_dataset_context(context: Dict[str, Any]) -> str:
    """
    Format dataset context information for inclusion in the prompt.
    
    Args:
        context: Dictionary containing dataset context
        
    Returns:
        Formatted string with dataset context
    """
    dataset_info = f"""
DATASET INFORMATION:
Name: {context['name']}
Rows: {context['rows']}
Columns: {len(context['columns'])}

SCHEMA:"""
    
    # Add column information
    for column in context['columns']:
        col_name = column['name']
        col_type = column['type']
        
        # Format example values
        example_str = f"[Example values: {', '.join(str(v) for v in column['example_values'])}]" if 'example_values' in column else ""
        
        # Add range and mean for numeric columns
        range_str = ""
        if 'min' in column and 'max' in column:
            range_str = f"[Range: {column['min']}-{column['max']}"
            if 'mean' in column:
                range_str += f", Mean: {column['mean']:.2f}"
            range_str += "]"
        
        dataset_info += f"\n- {col_name} ({col_type}): {example_str} {range_str}".strip()
    
    # Add data quality information if available
    if context.get('missing_values'):
        dataset_info += "\n\nDATA QUALITY:"
        for col, missing in context['missing_values'].items():
            dataset_info += f"\n- Missing values: {missing['count']} missing values in '{col}' column ({missing['percentage']:.1f}%)"
    
    return dataset_info

def _get_format_instructions(query_type: Optional[str] = None) -> str:
    """
    Get format instructions based on the query type.
    
    Args:
        query_type: Type of query
        
    Returns:
        Format instruction string
    """
    # Default format instruction
    default_format = """
Format your response as follows:

## Summary
[Provide a brief summary of your answer]

## Analysis
[Provide detailed analysis]

## Code Example
```python
# Include relevant Python code here
```

## Additional Considerations
[Include any caveats, assumptions, or additional information]
"""
    
    # Specific format instructions based on query type
    if not query_type:
        return default_format
    
    format_instructions = {
        "correlation": """
Format your response as follows:

## Correlation Summary
[Summarize the key correlations found or likely to exist]

## Detailed Analysis
[Provide statistical analysis of correlations]

## Visualization Code
```python
# Code to visualize the correlations
```

## Interpretation
[Explain what these correlations mean for the data]
""",
        "data_quality": """
Format your response as follows:

## Data Quality Summary
[Summarize the key data quality issues]

## Quality Issues
[List and explain each quality issue]

## Cleaning Code
```python
# Code to clean and improve the data
```

## Recommendations
[Provide recommendations for improving data quality]
""",
        "visualization": """
Format your response as follows:

## Recommended Visualizations
[List recommended visualization types]

## Implementation
```python
# Code to implement the visualizations
```

## Interpretation Guide
[Explain how to interpret these visualizations]

## Alternative Approaches
[Suggest alternative visualization approaches if applicable]
"""
    }
    
    return format_instructions.get(query_type, default_format)
