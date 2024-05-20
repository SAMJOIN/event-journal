import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Event, Importance } from "../App";
import style from "./Table.module.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { memo, useCallback } from "react";
import { Row } from "primereact/row";

interface TableProps {
  events: Event[];
  filtredEvents: Event[];
  getCountOfTableRow: () => number;
  readMark: (id: number) => void;
}

const Table: React.FC<TableProps> = memo(
  ({ events, filtredEvents, getCountOfTableRow, readMark }) => {
    // const rowStyling = (rowData) => {
    //   //TODO Стили не применяются
    //   if (rowData.read) {
    //     return { backgroundColor: "red", color: "black" };
    //   } else {
    //     return { backgroundColor: "rgba(0, 115, 255, 0.63)", color: "black" };
    //   }
    // };
    const rowStyling = (rowData) => {
        if (rowData.read) {
          return style.readRow;
        } else {
          return style.ureadRow;
        }
      };

    return (
      <div className={style.tableBox}>
        <DataTable
          className={style.table}
          value={filtredEvents.length > 0 ? filtredEvents : events}
          emptyMessage="No events found."
          paginator
          showGridlines
          removableSort 
          filterDisplay="row"
          rows={getCountOfTableRow()}
          selectionMode="single"
          rowClassName={rowStyling}
          onSelectionChange={(e) => {
            readMark(e.value.id);
          }}
          dragSelection
        >
          <Column style={{width:'20rem'}} sortable field="date" header="Дата" />
          <Column filterField="importance" filter field="importance" header="Важность" />
          <Column filterField="equipment"  filter field="equipment" header="Оборудование" />
          <Column style={{width: '50rem'}} field="message" header="Сообщение" />
          <Column filter field="person" header="Ответственный" />
        </DataTable>
      </div>
    );
  }
);

export default Table;
