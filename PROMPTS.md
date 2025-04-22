# LLM Prompt Documentation

This document outlines the prompt engineering approach used in the Enhanced Data Insight Generator. Effective prompts are crucial for obtaining high-quality, relevant responses from LLMs when analyzing datasets.

## Prompt Structure

Our prompts follow a structured format to provide context and guidance to the LLMs:

```
{system_instruction}

{dataset_context}

{user_query}

{response_format_instruction}
```

## System Instruction Templates

### General Analysis Prompt

```
You are a data analysis assistant helping a user understand their dataset. 
Provide clear, concise, and accurate information based on the dataset details provided.
Focus on being educational and actionable with your responses.
When suggesting visualizations or analyses, provide specific Python code examples using pandas, matplotlib, or seaborn.
```

### Statistical Analysis Prompt

```
You are a statistical analysis expert. Analyze the provided dataset information and answer the user's question with statistical rigor.
Explain your reasoning step by step, and provide appropriate statistical methods and code examples.
If multiple approaches are possible, explain the tradeoffs between them.
```

### Visualization Recommendation Prompt

```
You are a data visualization specialist. Based on the dataset information provided, recommend the most appropriate visualization approach for the user's needs.
Include specific code examples using matplotlib, seaborn, or plotly that the user can directly apply to their data.
Explain why your recommended visualization is appropriate for this particular data structure and question.
```

## Dataset Context Construction

For each query, we construct a dataset context section that includes:

1. **Dataset Overview**: Basic information about the dataset (name, size, format)
2. **Schema Information**: Column names, data types, and sample values
3. **Statistical Summary**: Basic statistics for numerical columns (min, max, mean, etc.)
4. **Data Quality Information**: Missing values, duplicates, outliers

Example:

```
DATASET INFORMATION:
Name: sales_data.csv
Rows: 1,245
Columns: 6

SCHEMA:
- date (datetime64): Date of sale [Example values: 2023-01-01, 2023-01-02]
- product_id (int64): Unique product identifier [Example values: 1001, 1002, 1003]
- category (string): Product category [Example values: "Electronics", "Home", "Clothing"]
- quantity (int64): Number of units sold [Range: 1-50, Mean: 5.7]
- price (float64): Unit price [Range: $9.99-$499.99, Mean: $78.45]
- customer_id (int64): Customer identifier [Example values: 5001, 5002]

DATA QUALITY:
- Missing values: 23 missing values in 'category' column (1.8%)
- Duplicates: No duplicate rows detected
```

## Response Format Instructions

To ensure structured, consistent responses, we include formatting instructions:

```
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
```

## Prompt Variations by Query Type

### Correlations Analysis

```
Analyze the potential correlations between variables in this dataset. Focus specifically on the relationship between [column1] and [column2].
Provide a correlation coefficient and visualization code to illustrate this relationship.
```

### Data Quality Assessment

```
Analyze the data quality issues in this dataset. Identify potential problems like missing values, outliers, or inconsistencies.
Suggest approaches to handle these issues with specific code examples.
```

### Feature Engineering

```
Suggest potential feature engineering approaches for this dataset. Consider the user's goal of [user_goal].
Provide specific code examples for implementing these features.
```

### Predictive Modeling

```
Recommend an appropriate predictive modeling approach for this dataset, where the target variable is [target_column].
Explain why this approach is suitable and provide starter code for implementing it.
```

## Example Complete Prompt

Here's an example of a complete prompt for correlation analysis:

```
You are a data analysis assistant helping a user understand their dataset. 
Provide clear, concise, and accurate information based on the dataset details provided.
Focus on being educational and actionable with your responses.
When suggesting visualizations or analyses, provide specific Python code examples using pandas, matplotlib, or seaborn.

DATASET INFORMATION:
Name: sales_data.csv
Rows: 1,245
Columns: 6

SCHEMA:
- date (datetime64): Date of sale [Example values: 2023-01-01, 2023-01-02]
- product_id (int64): Unique product identifier [Example values: 1001, 1002, 1003]
- category (string): Product category [Example values: "Electronics", "Home", "Clothing"]
- quantity (int64): Number of units sold [Range: 1-50, Mean: 5.7]
- price (float64): Unit price [Range: $9.99-$499.99, Mean: $78.45]
- customer_id (int64): Customer identifier [Example values: 5001, 5002]

DATA QUALITY:
- Missing values: 23 missing values in 'category' column (1.8%)
- Duplicates: No duplicate rows detected

USER QUESTION:
Is there a correlation between product price and quantity sold? How can I visualize this relationship?

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
```

## Prompt Adaptation Strategy

Our system adaptively modifies prompts based on:

1. **User Question Type**: We detect the question type and select the appropriate template
2. **Dataset Characteristics**: We emphasize relevant dataset features based on the question
3. **Previous Interactions**: We may reference previous queries for continuity
4. **LLM Selection**: We slightly modify prompts based on whether Gemini or DeepSeek is selected

## Fallback Mechanism

If a response from one LLM fails or is inadequate, we implement a fallback strategy:
1. Retry with the same LLM using a simplified prompt
2. If still unsuccessful, switch to the alternative LLM
3. If both fail, provide a graceful error message with troubleshooting suggestions

## LLM-Specific Optimizations

### Gemini Optimizations

For Gemini, we've found the following techniques to be effective:

1. **Temperature Setting**: Lower temperature (0.2) for factual responses, slightly higher (0.4-0.7) for creative code generation
2. **Explicit Code Requests**: Using phrases like "Write Python code that..." rather than "How would you..."
3. **Context Formatting**: Bullet points and clear section breaks improve comprehension
4. **Example-Driven Prompting**: Including example inputs/outputs for complex tasks

### DeepSeek Optimizations

For DeepSeek, these techniques have proven effective:

1. **Detail-Oriented Prompts**: More detailed instructions yield better results
2. **Step-by-Step Requests**: Explicitly asking for step-by-step explanations
3. **Format Specification**: Very explicit formatting instructions
4. **Code Focus**: Emphasizing production-ready, commented code

## Continuous Improvement

We regularly evaluate and refine our prompts based on:

1. User feedback on response quality
2. Analysis of unsuccessful queries
3. Comparison of responses between LLM providers
4. Emergence of new best practices in prompt engineering

This documentation will be updated as we discover more effective prompting strategies.
