import json


question_data = {}
# Function to read and parse the JSON file
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Main function
def main():
    global question_data

    # Path to the JSON file
    file_path = 'question_data.json'
    
    # Read and parse the JSON file
    data = read_json_file(file_path)
    
    # Print out the data to see its structure
    for slug, json_str in data.items():
        print(f"Slug: {slug}")
        print("Data:")
        # Load the JSON string into a Python dictionary
        question_data = json.loads(json_str)
        print(json.dumps(question_data, indent=2))  # Pretty print the data
        print()

if __name__ == '__main__':
    main()