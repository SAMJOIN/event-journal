import { Event } from "../App";
import style from "./Card.module.css";
import { memo } from "react";
interface CardProps {
  event: Event;
  readMark: (id: number) => void;
}

const Card: React.FC<CardProps> = memo(({ event, readMark }) => {
  return (
    <div
      tabIndex={0}
      className={`${style.card} ${event.read ? style.read : ""}`}
      onKeyDown={(e) => {
        if (e.code === "Space") {
          readMark(event.id);
        }
      }}
    >
      <table>
        <tbody>
          <tr>
            <td>Дата</td>
            <td>{event.date}</td>
            <td></td>
          </tr>
          <tr>
            <td>Важность</td>
            <td>{event.importance}</td>
          </tr>
          <tr>
            <td>Оборудование</td>
            <td>{event.equipment}</td>
          </tr>
          <tr>
            <td>Сообщение</td>
            <td>{event.message}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <div className={style.img}></div>
        <div>{event.person}</div>
      </div>
    </div>
  );
});

export default Card;
