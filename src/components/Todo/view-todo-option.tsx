"use client";

import { ChangeEvent, useState } from "react";
import { TPaginationOption } from "~/types";

type Props = {
  option: TPaginationOption;
  updateOption: (page: number, limit: number) => void;
};

export default function ViewTodoOption({ option, updateOption }: Props) {
  const [options] = useState([5, 10, 15, 20, 25, 30]);

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateOption(1, Number(e.target.value));
  };

  return (
    <select
      value={option.limit}
      onChange={handleOptionChange}
      className=" py-1 px-1 cursor-pointer border border-1 rounded-md text-sm"
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
}
