"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./page.css";
import React from 'react'

const page = () => {
  return (
    <div className="parent">
    <div className="div1 px-5 rounded">
      <Image 
        src="/images/ayam_bakar_history.jpeg"  
        alt="Ayam Bakar" 
        className="rounded shadow-lg"
        width={500}
        height={400}
      />
    </div>
    <div className="div2">
        <h1 className="fs-1 fw-bold">Our History Progress</h1>
        <p className="text-muted text-justify">It all began in 2001, in a small food stall tucked beside Walikota Lama. With nothing more than a simple grill, a family recipe, and a big dream, our founders started serving freshly grilled chicken to locals passing by. Every day, the irresistible aroma of smoky, seasoned chicken filled the air, slowly drawing in regular customers who came not just for the food, but for the warmth and friendliness behind every plate. 
        <br/><br/>
        However, the journey wasn't always easy. The first few years brought many challenges — from unpredictable weather and limited space to tough competition. There were moments when giving up seemed like the only option, but our founders held onto their passion and belief that good food brings people together.
        <br/><br/>
        After two years of hard work, in 2003, the business found a new home beside Universitas Tarumanagara (UNTAR). The move marked a turning point. With more space and a growing community of students and locals nearby, our little grilled chicken stall quickly became a favorite spot for anyone craving authentic, freshly grilled goodness.
        <br/><br/>
        Over the years, we've stayed true to our roots — using the same traditional recipe, grilling over open flames, and serving with the same dedication that started it all. From humble beginnings beside Walikota Lama to a beloved eatery beside UNTAR, our story is one of perseverance, flavor, and family.
        <br/><br/>
        Today, we continue to grill with passion, serve with heart, and welcome every guest like an old friend — because for us, it's not just about chicken, it's about the joy that comes with sharing it.</p>
    </div>
    </div>
  )
}

export default page
