"use client";
import Image from "next/image";
import SelectComponent from "./(components)/selectComponent";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";

interface ISingleCarData {
  MakeId: number;
  MakeName: string;
  VechicleTypeId: number;
  VehicleTypeName: string;
}
export default function Home() {
  const currentYear = new Date().getFullYear();
  const yearsRange = Array.from(
    { length: currentYear - 2015 + 1 },
    (_, i) => 2015 + i
  );
  const [carsData, setCarsData] = useState([] as ISingleCarData[] | []);
  const [selectedCar, setSelectedCar] = useState(440);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const fetchCarsData = async () => {
    const responce = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`,
      {
        method: "GET",
      }
    );
    const data = await responce.json();
    setCarsData(data?.Results);
  };

  useEffect(() => {
    fetchCarsData();
  }, []);

  useEffect(() => {
    setSelectedCar(carsData[0]?.MakeId);
  }, [carsData, setCarsData]);

  return (
    <main>
      <h1>car dealer app {currentYear}</h1>
      <label htmlFor="car-select">car:</label>
      <select
        name="car-select"
        value={selectedCar}
        onChange={(e) => setSelectedCar(+e.target.value)}
      >
        {carsData?.map((item) => (
          <option value={item?.MakeId} key={item?.MakeId}>
            {item?.MakeName}
          </option>
        ))}
      </select>
      <label htmlFor="year-select">year:</label>
      <select
        name="year-select"
        value={selectedYear}
        onChange={(e) => setSelectedYear(+e.target.value)}
      >
        {yearsRange?.map((year) => (
          <option value={year} key={year}>
            {year}
          </option>
        ))}
      </select>
      <h3>
        {selectedCar}-{selectedYear}
      </h3>
      <Link href={`result/${selectedCar}/${selectedYear}`}>
        <button>NEXT</button>
      </Link>
    </main>
  );
}
