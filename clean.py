import pandas as pd
import os
import re

def split_team_position(row):
    team = row['Team']
    position = row['Position']
    
    if pd.notna(position) and position != '':
        return team, position
    
    if pd.isna(team):
        return '', ''
    
    # Handle special case for Utah and potentially other 4-letter team names
    match = re.match(r'(Utah|[A-Z][a-z]{2})([A-Z]{1,2})$', str(team))
    if match:
        return match.group(1), match.group(2)
    
    return team, ''

def process_fantasy_data(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist.")

    # Read the CSV file
    df = pd.read_csv(file_path)

    # Split Team and Position only when necessary
    df[['Team', 'Position']] = df.apply(split_team_position, axis=1, result_type='expand')

    # Reorder columns
    columns_order = ['Rank', 'Player', 'Team', 'Position'] + [col for col in df.columns if col not in ['Rank', 'Player', 'Team', 'Position']]
    df = df[columns_order]

    return df

if __name__ == "__main__":
    file_path = 'C:/Users/Jason/fantasyhelper/fantasyhelper/processed_DRAFT_2024v3.csv'
    try:
        processed_df = process_fantasy_data(file_path)
        
        # Save the processed data to a new CSV file
        output_path = 'C:/Users/Jason/fantasyhelper/fantasyhelper/processed_DRAFT_2024v5.csv'
        processed_df.to_csv(output_path, index=False)
        print(f"Processed data saved to {output_path}")
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        import traceback
        print(traceback.format_exc())