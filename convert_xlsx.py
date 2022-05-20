import openpyxl
import argparse
import json


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="tiku.xlsx")
    parser.add_argument("--output", default="data.json")
    parse_result = parser.parse_args()
    doc = openpyxl.load_workbook(parse_result.input)
    sheet = doc.active
    result = []
    for line in sheet.iter_rows():
        stmt, answer = line[:2]
        if stmt.value is None or answer.value is None:
            continue
        result.append({
            "statement": str(stmt.value),
            "answer": str(answer.value)
        })
    with open(parse_result.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False)


if __name__ == "__main__":
    main()
