import React from "react";

export default function SelectComponent(
  selectName: string,
  selectId?: string
) {
  return (
    <div>
      <select name={selectName} id={selectId}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );
}
