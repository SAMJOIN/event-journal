import { useCallback, useEffect, useState } from "react";

import "primereact/resources/themes/saga-blue/theme.css";
import style from "./App.module.css";
import Card from "./Card/Card";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Table from "./Table/Table";

enum Importance {
  Критическая,
  Высокая,
  Низкая,
}
enum Equipment {
  Вегас,
  Коммутатор,
  Люк,
  ИБП,
  Трансформатор,
  ЛВС,
}
enum Person {
  "Смирнов В.А.",
  "Капустин С.С.",
  "Ветрова И.С.",
  "Лавочкин А.В.",
  "Ольшанская Е.Г.",
}

export interface Event {
  id: number;
  date: string;
  importance: Importance;
  equipment: Equipment;
  message: string;
  person: Person;
  read: boolean;
}

const getCountOfCard = () => {
  let widthOfCard = 420;
  const heightOfCard = 170;
  let widthOfWindow = window.innerWidth - 100;
  const heightOfWindow = window.innerHeight - 170;
  if (widthOfWindow <= 440) {
    widthOfCard = 390;
    widthOfWindow = window.innerWidth;
  }
  return (
    Math.floor(widthOfWindow / widthOfCard) *
    Math.floor(heightOfWindow / heightOfCard)
  );

};

const getCountOfTableRow = () => {
  let heightOfRow = 22;
  const heightOfWindow = window.innerHeight - 200;
  const widthOfWindow = window.innerWidth;
  if (widthOfWindow < 750) {
    heightOfRow = 43;
  } 
  return Math.floor(heightOfWindow / heightOfRow);
};

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(() =>
    getCountOfCard()
  );
  const [page, setPage] = useState<number>(1);
  const [tableMode, setTableMode] = useState<boolean>(true);
  const [filtredEvents, setFiltredEvents] = useState<Event[]>(events);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newEvent: Event = {
        id: events.length + 1,
        date: `${new Date().toLocaleString()}`,
        importance: Importance[(Math.random() * 2).toFixed(0)],
        equipment: Equipment[(Math.random() * 5).toFixed(0)],
        message: `Message ${events.length}`,
        person: Person[(Math.random() * 4).toFixed(0)],
        read: false,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [events]);

  const readMark = (id: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, read: true } : event
      )
    );
  };

  const onPageChange = useCallback((event: { first: number; rows: number }) => {
    setPage(event.first / event.rows + 1);
    setItemsPerPage(event.rows);
  },[]);

  const renderCardItems = (events: Event[]) => {
    return (
      <div className={style.contentBox}>
        {events
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((event) => (
            <Card key={event.id} readMark={readMark} event={event} />
          ))}
        <Paginator
          className={style.paginator}
          first={(page - 1) * itemsPerPage}
          rows={itemsPerPage}
          totalRecords={
            filtredEvents.length > 0 ? filtredEvents.length : events.length
          }
          onPageChange={onPageChange}
        />
      </div>
    );
  };

  const findeItems = useCallback(() => {
    if (searchText.length > 0) {
      setFiltredEvents(
        events.filter((event) =>
          event.message.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFiltredEvents([]);
    }
  }, [events, searchText]);

  const renderItems = () => {
    if (tableMode) {
      return (
        <Table
          events={events}
          filtredEvents={filtredEvents}
          readMark={readMark}
          getCountOfTableRow={getCountOfTableRow}
        />
      );
    } else {
      if (filtredEvents.length > 0) {
        return renderCardItems(filtredEvents);
      } else {
        return renderCardItems(events);
      }
    }
  };

  return (
    <div>
      <div className={style.header}>
        <div className={style.buttonBox}>
          <Button
            className={style.button}
            onClick={() => setTableMode(true)}
            label="Таблица"
          />
          <Button
            className={style.button}
            onClick={() => setTableMode(false)}
            label="Карточки"
          />
        </div>
        <div className={style.searchBox}>
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search events"
            className={style.input}
          />
          <Button
            className={style.button}
            onClick={() => findeItems()}
            label="Найти"
          />
        </div>
      </div>
      {renderItems()}
    </div>
  );
};

export default App;
