export const getColumn = (workbook, column, start, end) => {
  var first_sheet_name = workbook.SheetNames[0]; // 获取工作簿中的工作表名字
  var address_of_cell = 'A1'; // 提供一个引用样式(单元格下标)

  var worksheet = workbook.Sheets[first_sheet_name]; // 获取对应的工作表对象

  var desired_cell = worksheet[address_of_cell]; // 获取对应的单元格对象

  var desired_value = (desired_cell ? desired_cell.v : undefined)
}