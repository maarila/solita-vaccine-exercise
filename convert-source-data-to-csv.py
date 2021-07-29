import json
import csv


def read_json_file_to_list(source_path: str, source_files: list, target_list: list):
    for source_file in source_files:
        with open(f"{source_path}{source_file}") as file:
            for line in file:
                line_as_dict = json.loads(line)
                target_list.append(line_as_dict)


def write_list_to_csv(target_path: str, target_file: str, fieldnames: list, source_list: list):
    with open(f"{target_path}{target_file}", "w", encoding="UTF8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames, delimiter=";")
        writer.writeheader()
        writer.writerows(source_list)


source_path = './original-source-data/'
target_path = './resources/'

order_source_files = ['Antiqua.source',
                      'SolarBuddhica.source', 'Zerpfy.source']
vaccination_source_files = ['vaccinations.source']

order_target_file = "orders.csv"
vaccination_target_file = "vaccinations.csv"

order_fieldnames = ["id", "orderNumber", "responsiblePerson",
                    "healthCareDistrict", "vaccine", "injections", "arrived"]
vaccination_fieldnames = ["vaccination-id",
                          "sourceBottle", "gender", "vaccinationDate"]

all_orders = []
all_vaccinations = []

read_json_file_to_list(source_path, order_source_files, all_orders)

read_json_file_to_list(
    source_path, vaccination_source_files, all_vaccinations)

write_list_to_csv(target_path, order_target_file,
                  order_fieldnames, all_orders)
write_list_to_csv(target_path, vaccination_target_file,
                  vaccination_fieldnames, all_vaccinations)
