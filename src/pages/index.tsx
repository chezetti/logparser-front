import { useState } from "react";
import styles from "../../styles/Home.module.css";
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import Head from 'next/head'
import 'chart.js/auto';

import Image from "next/image";
import Content from "./components/Content";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Ontleder</title>
      </Head>
      <div className="">
        <Content />
      </div>
    </div>
  );
}