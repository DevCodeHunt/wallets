import {Parser} from "json2csv"

export const exportCSV = (res, headers, data, fileName) => {
  const json2csvParser = new Parser({fields: headers})
  const csv = json2csvParser.parse(data)
  res.header("Content-Type", "text/csv")
  res.attachment(fileName)
  return res.send(csv)
}
