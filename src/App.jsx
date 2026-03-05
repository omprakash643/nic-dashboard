import { useState, useMemo } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ── RAW DATA ─────────────────────────────────────────────────────────────── */
const VISITORS = [
  {"date": "2026-01-12", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "sp pulses", "contact": "tikam sharma", "state": "Rajasthan", "city": "ajmer", "existing": "No", "remarks": "Sortex on moong mogar 10 chute, waiting for the order of hem industries"},
  {"date": "2026-01-12", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Hem industries", "contact": "Rishabh", "state": "Rajasthan", "city": "ajmer", "existing": "No", "remarks": "Sortex on moong mogar, 8 chute order finalised after 14th Jan"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "hem industries", "contact": "rishabh", "state": "Rajasthan", "city": "Ajmer", "existing": "No", "remarks": "Sortex on Moong mogar, Final price given, customer is at gulf expo dubai"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Chetak roller flour mill", "contact": "Nitesh khokhar", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Chaudhary flour mill pvt ltd", "contact": "Vinod Gupta", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Hindusthan rice mill", "contact": "Binod ji", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Amar Rice mill", "contact": "Amar jaiswal", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Chaudhary flour mill pvt ltd", "contact": "Vinod Gupta", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "Discussion for color sorter enquiry"},
  {"date": "2026-01-27", "leadType": "MCS with KAESER Compressor", "user": "Shivgatulla", "customer": "BL foods and oils pvt ltd", "contact": "Ram jaiswal", "state": "Uttar Pradesh", "city": "Basti", "existing": "Competitors", "remarks": "10 Chute color sorter and 60 HP kaeser compressor enquiry"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "SAI KIRPA STEEL INDUSTRY", "contact": "RAKESH KUMAR JI", "state": "Delhi", "city": "BAWANA", "existing": "compititor", "remarks": "AS DISCUSSED WITH CUSTOMER THE REQUIR COMPRESSOR IN NEXT 6 MONTHS"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "SAI KIRPA STEEL INDUSTRY", "contact": "RAKESH KUMAR JI", "state": "Delhi", "city": "BAWANA", "existing": "compititor", "remarks": "AS DISCUSSED WITH CUSTOMER THE REQUIR COMPRESSOR IN NEXT 6 MONTHS"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Vardhan industries", "contact": "Aman jain", "state": "Madhya Pradesh", "city": "Begamganj", "existing": "Milltech", "remarks": "Plant has been shutdown due loss in business new plant installed last year with milltech sortex"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Sanjay traders", "contact": "Sanjay jain", "state": "Madhya Pradesh", "city": "Begamganj", "existing": "Grading plant", "remarks": "Using grading plant on wheat no requirement for sortex"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Rai traders", "contact": "Pankaj rai", "state": "Madhya Pradesh", "city": "Begamganj", "existing": "Atta mill", "remarks": "Using chakki plant atta 4 chakki using interested in packing machine"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Shree balaji food industriese", "contact": "Kamlesh Gupta", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Balaji oil industry", "contact": "Chenu rajabat", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Gowlior distilleries", "contact": "Anurag Yadav", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shree traders", "contact": "Manish Jain", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Mayur trending company", "contact": "Price Gupta", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Saurabh trending company", "contact": "Suresh Yadav", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-22", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Chambal oil products pvt ltd", "contact": "Chhotu Kuswaha", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan air compressor next year"},
  {"date": "2026-01-22", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Kuswaha Oli Mil", "contact": "Sonu kuswaha", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan air compressor next year"},
  {"date": "2026-01-22", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shukla and sons", "contact": "Chirag Shukla", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-22", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shree Ram bhog flour mil", "contact": "Mukesh Jain", "state": "Madhya Pradesh", "city": "Bhind", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-20", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Shanti pulses", "contact": "Ashish agrawal", "state": "Madhya Pradesh", "city": "Bina", "existing": "Buhler", "remarks": "Using buhler sortex want to change sortex in upcoming season"},
  {"date": "2026-01-27", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Mahant", "customer": "Khan cold storage", "contact": "Arbaz Khan", "state": "Madhya Pradesh", "city": "Bina", "existing": "N/a", "remarks": "Cold storage under construction on banana fruit"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Dhanraj industries", "contact": "Gaurav rajpal", "state": "Madhya Pradesh", "city": "Bina", "existing": "Salasar", "remarks": "Planning 6 chute old sortex meyer"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Vardhman dall mill", "contact": "Rahul jain", "state": "Madhya Pradesh", "city": "Bina", "existing": "Mark", "remarks": "Planning 6 chute sortex dlt for matter want quatation"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Sonu traders", "contact": "Sandeep Kumar jain", "state": "Madhya Pradesh", "city": "Bina", "existing": "New plant", "remarks": "Plan under hold for some days soon order finalized for sortex and compressor"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Nikhil traders", "contact": "Nikhil panwani", "state": "Madhya Pradesh", "city": "Bina", "existing": "Filter plant", "remarks": "Plan has been hold for sortex and compressor by amount has been seems high for sortex and compressor"},
  {"date": "2026-01-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mankamna oil and foods processing pvt ltd", "contact": "Bhikam chand Agrawal", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for color"},
  {"date": "2026-01-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahabir Agro industries pvt ltd", "contact": "Bhikam chand Agrawal", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Triveni Dal and oils industries pvt ltd", "contact": "Shubham khandelwal", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Narayani modern pulses industries", "contact": "Mohan lal chachan ji", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shiv Shakti Dall Mill", "contact": "Roshan ji", "state": "Nepal", "city": "Birganj", "existing": "comp", "remarks": "discussion for color sorter"},
  {"date": "2026-01-29", "leadType": "AIR DRYER", "user": "Shivgatulla", "customer": "Om international", "contact": "Manoj Gupta", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for channel partner"},
  {"date": "2026-01-29", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mohit Agro industries pvt ltd", "contact": "Mohit Gupta", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-29", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mayur rice mill", "contact": "Mayur ji", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-29", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Ganesh trading company", "contact": "Ganesh ji", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for channel partner"},
  {"date": "2026-01-29", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Narayani modern pulses industries", "contact": "Sushant chachan", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-30", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Aryan international trading pvt ltd", "contact": "Harish ji", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Discussion for channel partner"},
  {"date": "2026-01-30", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Om khadaya Udhyog", "contact": "Joginder ji", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-30", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Om industries pvt ltd", "contact": "Manoj ji", "state": "Nepal", "city": "Birganj", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-02", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Maa Madanpur trading and rice mill", "contact": "Bharat Gupta", "state": "Nepal", "city": "Bodarwar", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-02", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Baijnath modern rice mill", "contact": "Sonu singh", "state": "Uttar Pradesh", "city": "Bodarwar", "existing": "Competitors", "remarks": "Previous year 7 chute meyer color installed"},
  {"date": "2026-01-02", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Maa aadishakti traders", "contact": "Sunil Patel", "state": "Uttar Pradesh", "city": "Bodarwar", "existing": "Competitors", "remarks": "10 Chute Meyer color sorter previous year finalized"},
  {"date": "2026-01-05", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Aksham agri products pvt ltd", "contact": "Mr shiv maheshwari", "state": "Rajasthan", "city": "Chittorgarh", "existing": "Competitor's customer", "remarks": "I met Mr Shiv and told him about the Meyer color sorter, he told me that I don't need it right now b"},
  {"date": "2026-01-05", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "R K Agro Industries", "contact": "Mr Ram", "state": "Rajasthan", "city": "Chittorgarh", "existing": "Competitor's customer", "remarks": "I met Ram ji and told him about the Meyer color sorter, he told me that I have installed Sortex just"},
  {"date": "2026-01-05", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Heeramani sortex", "contact": "Mr Mukesh Jain", "state": "Rajasthan", "city": "Chittorgarh", "existing": "Competitor's customer", "remarks": "I met Mukesh ji and told him about the Meyer color sorter, he told me that right now I have the QED "},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "ambavala industries", "contact": "Salim", "state": "Gujrat", "city": "dahod", "existing": "No", "remarks": "Quote send 4 chute smart model"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Rohit dal mill", "contact": "Deepak nawami", "state": "Madhya Pradesh", "city": "Damoh", "existing": "Unique", "remarks": "Using unique sortex 5 chute on matter business running slow no requirement in current"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Laxmi Narayan dal mill", "contact": "Subhas asati", "state": "Madhya Pradesh", "city": "Damoh", "existing": "Unique", "remarks": "Planning 5 chute sortex in upcoming season on matter"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Shyam mahesh dal mill", "contact": "Anand Gupta", "state": "Madhya Pradesh", "city": "Damoh", "existing": "Filter plant", "remarks": "Using filters plant on toor dal no requirement for sortex planning in future"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Agrwal dal mill", "contact": "Akash jain", "state": "Madhya Pradesh", "city": "Damoh", "existing": "Unique", "remarks": "Plan has been postponed according to customer for new dunki removal sortex on masoor dal"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Vardhman dal mill", "contact": "Avneesh jain", "state": "Madhya Pradesh", "city": "Damoh", "existing": "Unique", "remarks": "Recently installed unique sortex not satisfied by results no requirement in current planning in summ"},
  {"date": "2026-01-06", "leadType": "MCS+MRC", "user": "Shivgatulla", "customer": "Depali enterprises", "contact": "Sudipta hati", "state": "West Bengal", "city": "Dantan", "existing": "Competitors", "remarks": "8 chute color sorter and 40 HP MRC enquiry"},
  {"date": "2026-01-18", "leadType": "MCS+MRC", "user": "Shivgatulla", "customer": "Mithila rice mill", "contact": "Sanjay jha", "state": "Bihar", "city": "Darbhanga", "existing": "Competitors", "remarks": "8 Chute color sorter and 50 HP MRC COMPRESSOR"},
  {"date": "2026-01-18", "leadType": "MCS+MRC", "user": "Shivgatulla", "customer": "Mithila rice mill", "contact": "Sanjay jha", "state": "Bihar", "city": "Darbhanga", "existing": "Competitors", "remarks": "8 Chute color sorter and 40 HP MRC COMPRESSOR"},
  {"date": "2026-01-21", "leadType": "AIR DRYER", "user": "Ashwin Garg", "customer": "SPG Tech", "contact": "Sumit", "state": "Delhi", "city": "Delhi", "existing": "Buhler", "remarks": ""},
  {"date": "2026-01-30", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Roca bathroom products pvt ltd", "contact": "Shailendra singh tawar", "state": "Madhya Pradesh", "city": "Dewas", "existing": "Existing kaeser compressor user", "remarks": "Kaeser compressor user"},
  {"date": "2026-01-30", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Gajra Diffrential gears limited", "contact": "Mr. D.K. Carpenter", "state": "Madhya Pradesh", "city": "Dewas", "existing": "Competitor customer", "remarks": "Enquiry generate Kaeser screw air compressor Capacity 350 Cfm Pressure - 7.5 bar With VFD, dryer and"},
  {"date": "2026-01-30", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Navkar techtex pvt ltd", "contact": "Mr. Avinash madapi", "state": "Madhya Pradesh", "city": "Dewss", "existing": "Competitor customer - elgi 15 KW", "remarks": "Competitor customer Elgi 15 kw user"},
  {"date": "2026-01-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Hanuman ji roller flour mill", "contact": "Manager", "state": "West Bengal", "city": "Durgapur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Hanumanta foods products Pvt Ltd", "contact": "S.s verma", "state": "West Bengal", "city": "Durgapur", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Bharat mata Agro industries", "contact": "Sidhant Ji", "state": "West Bengal", "city": "Durgapur", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-06", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "S.k seeds farm", "contact": "Rajesh Kumar", "state": "Uttar Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-06", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Chandan seeds farm", "contact": "Chandan kumar", "state": "Uttar Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-14", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Baba treders", "contact": "Avdesh Yadav", "state": "Uttar Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan grain drayer"},
  {"date": "2026-01-14", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Vijay Singh treders", "contact": "Shailendra Pratap Singh", "state": "Uttar Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan grain drayer"},
  {"date": "2026-01-14", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Banke Bihari trending company", "contact": "Pradeep Yadav", "state": "Uttar Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan grain drayer"},
  {"date": "2026-01-14", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Jangi Singh and sons", "contact": "Ramautar Yadav", "state": "Uttar Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan grain drayer"},
  {"date": "2026-01-17", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Agara tyar treders", "contact": "Javed Ahmed", "state": "Madhya Pradesh", "city": "Etawah", "existing": "Construction", "remarks": "Plan air compressor"},
  {"date": "2026-01-10", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shree shyam industry", "contact": "Pardeep kasniya", "state": "Haryana", "city": "Fathebad", "existing": "Competitor", "remarks": "Meeting with MD Peanut colour sorter Requirement this month"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Neev food products", "contact": "Vipin patel", "state": "Madhya Pradesh", "city": "Gairatganj", "existing": "Satake", "remarks": "Planning 75 ho kaeser compressor 10 chute sortex and packing machine"},
  {"date": "2026-01-13", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Sharda jagdamba dal mill", "contact": "Praveen khandelwal", "state": "Madhya Pradesh", "city": "Ganjbasoda", "existing": "Qed", "remarks": "Planning for 8 chute sortex has been postponed"},
  {"date": "2026-01-17", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Lakhdatar international Pvt Ltd", "contact": "Shivam goyal", "state": "Haryana", "city": "Ghrounda", "existing": "Na", "remarks": "Meeting with MD Plant add Requirement time 2 month"},
  {"date": "2026-01-17", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "R.m overseas", "contact": "Manoj jain", "state": "Haryana", "city": "Ghrounda", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-01-03", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahashakti foods pvt ltd", "contact": "Aakash jalan", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "13 Chute color sorter enquiry"},
  {"date": "2026-01-03", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shashwat flour mill", "contact": "Sandeep ji", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Color sorter presentation done"},
  {"date": "2026-01-03", "leadType": "AIR DRYER", "user": "Shivgatulla", "customer": "Shree Siddheshwari polypack", "contact": "Sudhanshu ji", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Eligi compressor user"},
  {"date": "2026-01-13", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahashakti foods pvt ltd", "contact": "Aakash jalan", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-13", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree Jethuji Agro industries pvt ltd", "contact": "Raj Kumar goel", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Satake user"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree Jethuji Agro industries pvt ltd", "contact": "Raj Kumar goel", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahashakti foods pvt ltd", "contact": "Akash Jalan", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "13 Chute color sorter"},
  {"date": "2026-01-10", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Rajshree trending company", "contact": "Raghvendra Kumar", "state": "Uttar Pradesh", "city": "Gursaiganj", "existing": "Construction", "remarks": "Plan grain drayer"},
  {"date": "2026-01-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Vinayak oils and fats pvt ltd", "contact": "Kishan Ji", "state": "West Bengal", "city": "Howarh", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry next season"},
  {"date": "2026-01-01", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Agrawal Bandhu", "contact": "Sahil Agrawal", "state": "Madhya Pradesh", "city": "Indore", "existing": "No", "remarks": "8 chute DLT on chana dal"},
  {"date": "2026-01-06", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "SitaShree Shreenarayan", "contact": "Rupesh Agrawal", "state": "Madhya Pradesh", "city": "Indore", "existing": "No", "remarks": "Sortex delivered, asking for compressor arrival date."},
  {"date": "2026-01-24", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Vardhman bakers pvt ltd", "contact": "Mr. Rounak kasliwal", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer - Atlas Copco, IR", "remarks": "General visits"},
  {"date": "2026-01-24", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Vinayak Enterprises", "contact": "Ayush Dubey", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor Customer- IR, Zen Air, FS Curtis", "remarks": "Kaeser Booster - N351- G Pressure Upto 7.5 to 35 bar @80 CFM"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Jai Ranjeet Traders", "contact": "Mr. Girish Lallani", "state": "Madhya Pradesh", "city": "Indore", "existing": "New Customer", "remarks": "Color Sorter Requirement"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "Varun mangal", "contact": "Varun mangal", "state": "Madhya Pradesh", "city": "indore", "existing": "No", "remarks": "Sortex on chickpeas, meeting schedule tomorrow at 1 PM"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Sudarshan pulses", "contact": "Mr. Paritosh Gupta", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Competitor customer"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Dinero food works", "contact": "Mr. Harmesh Landrieu", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer- CP 30 kw", "remarks": "CP user"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Worth wellness pvt ltd", "contact": "Mr. Nilesh Kumar shukla", "state": "Madhya Pradesh", "city": "Indore", "existing": "Kaeser user", "remarks": "Greenfield project - order done by kaeser"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Peshwa wheat ltd", "contact": "Mr. Rahat ji", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor- Elgi user", "remarks": "Competitor customer- Elgi user"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Haarish Equipments pvt ltd", "contact": "Mr. Santosh Rathore", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Plant expansion"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Zenith drugs limited", "contact": "Mr. Sanjeev", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Plant expansion"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Arvind Kumar", "customer": "AF Frozen Fruits and Vegetables Pvt Ltd", "contact": "Mr. Haji Bittan Ali", "state": "Madhya Pradesh", "city": "Islamnagar", "existing": "New customer", "remarks": "Discussion done regarding color sorter machine for frozen peas. He installed new plant and running. "},
  {"date": "2026-01-07", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "nathulal and sons", "contact": "Vinod", "state": "Madhya Pradesh", "city": "Jaora", "existing": "No", "remarks": "planning for 8 chute DLT model"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "Bhandari International", "contact": "Arpit bhandari", "state": "Madhya Pradesh", "city": "jaora", "existing": "No", "remarks": "Final quote send to customer for 8 chute Smart model on masoor dall"},
  {"date": "2026-01-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Brijesh bhubanes Cold storage", "contact": "Deleep kumar", "state": "Uttar Pradesh", "city": "Jaswantnagar", "existing": "Construction", "remarks": "Plan air compressor next year"},
  {"date": "2026-01-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "P.L COLD STORAGE", "contact": "Adesh kushwaha", "state": "Uttar Pradesh", "city": "Jaswantnagar", "existing": "Construction", "remarks": "Plan air compressor next year"},
  {"date": "2026-01-05", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Prabhat trading company", "contact": "Mr vinod jain", "state": "Rajasthan", "city": "Jhalawar", "existing": "No machine", "remarks": "I spoke to Vinod ji on call and told him about the Meyer color sorter, he told me that it will take "},
  {"date": "2026-01-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Shivgatulla", "customer": "Rayana paper Board Industries Ltd", "contact": "M.K rohilla", "state": "Uttar Pradesh", "city": "Khalilabad", "existing": "Competitors", "remarks": "100 HP kaeser compressor enquiry"},
  {"date": "2026-01-14", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Fie Refineries and chemical Pvt Ltd", "contact": "Santosh Gupta", "state": "Uttar Pradesh", "city": "Khalilabad", "existing": "Competitors", "remarks": "Kaeser compressor and color sorter"},
  {"date": "2026-01-14", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Dev industries", "contact": "Vivek Gupta", "state": "Uttar Pradesh", "city": "Khalilabad", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-14", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree bala ji Agro industries", "contact": "Kamlesh Gupta", "state": "Uttar Pradesh", "city": "Khalilabad", "existing": "Competitors", "remarks": "Miltak 8 TPH plant running from 5 year"},
  {"date": "2026-01-14", "leadType": "AIR DRYER", "user": "Shivgatulla", "customer": "Shree Laxmi rice mill", "contact": "Makku ji", "state": "Uttar Pradesh", "city": "Khalilabad", "existing": "Competitors", "remarks": "32 Tonne dryer enquiry"},
  {"date": "2026-01-01", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "KK Cotton", "contact": "Anoop agrawal", "state": "Madhya Pradesh", "city": "Khargone", "existing": "no", "remarks": "Sortex on chickpeas 6 chute DLT, discussion in progress"},
  {"date": "2026-01-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Baid Agro products Pvt Ltd", "contact": "Sandeep baid", "state": "West Bengal", "city": "Kolkata", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "J.N Agro", "contact": "Narayan ji", "state": "West Bengal", "city": "Kolkata", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-08", "leadType": "MCS+MRC", "user": "Shivgatulla", "customer": "Modi oils and packaging Pvt Ltd", "contact": "Shivam Modi", "state": "West Bengal", "city": "Kolkata", "existing": "Competitors", "remarks": "10 Chute color sorter and 50 HP MRC enquiry"},
  {"date": "2026-01-08", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Sameera cashew industries", "contact": "Mir beig", "state": "West Bengal", "city": "Kolkata", "existing": "Competitors", "remarks": "planning color sorter enquiry"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Banshidhar kailashchandra mehta", "contact": "Mr ronak", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Ronak ji and told him about grain dryer, packaging machine, compressor, then he told me that I"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Mangal udhyog", "contact": "Mr pankaj mangal", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I spoke to Pankaj ji and told him about the Meyer color sorter, he told me that he already has a kin"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Rathi tradeds", "contact": "Mr Avinash Rathi", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Avinash Rathi ji, he told me that we are already using Meyer sortex."},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "R J Enterprises", "contact": "Mr Dwarka prasad", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "I spoke to Dwarka ji and told him about the Meyer color sorter, he told me that right now I have no "},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Shree ram Rice mill", "contact": "Mr sunil mehta", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Sunil ji and told him about my products packaging machine, grain dryer, compressor and sortex,"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Manbhar devi agro industries", "contact": "Mr Lakshya Mehta", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Lakshya ji and told him about my products grain dryer, packaging machine and sortex, then he t"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Lakhdatar Trading company", "contact": "Mr bhupendra kumar soni", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "I met Bhupendra ji and told him about my grain dryer, packaging machine, compressor and Sortex, then"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Shree Vardhman industries", "contact": "Mr sunil jain", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Sunil ji and told him about my products grain dryer, packaging machine and sortex, then he tol"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Narayan Trading Company", "contact": "Mr avadhesh nagar", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "I met Awadhesh ji and told him about the Meyer color sorter, he told me that he works as a commissio"},
  {"date": "2026-01-22", "leadType": "PACKING MACHINE", "user": "Ujjwal Upadhyay", "customer": "Tolaram Satyadev agro pvt ltd", "contact": "Mr satyadev", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Satyadev ji and explained to him about the grain dryer, packaging machine, compressor and sort"},
  {"date": "2026-01-22", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Mahesh industries", "contact": "Mr mahesh singhal", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "I met Mahesh and explained to him about the Meyer color sorter, but he told me that he had no plans "},
  {"date": "2026-01-22", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Baldawa industries", "contact": "Mr Gaurav Baldawa", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Gaurav ji and told him about my products grain dryer, packaging machine, compressor and Sortex"},
  {"date": "2026-01-22", "leadType": "Grain Dryer", "user": "Ujjwal Upadhyay", "customer": "R. S. Industries", "contact": "Mr yatish Khandelwal", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Yatish ji and told him about my products grain dryer, packaging machine, compressor and Sortex"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Gambhir udhyog", "contact": "Mr Jatin gambhir", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I went there but Jatin ji was not there so I spoke to him on call and explained to him the issue of "},
  {"date": "2026-01-23", "leadType": "Grain Dryer", "user": "Ujjwal Upadhyay", "customer": "Charbhuja industries", "contact": "Mr Suresh Goyal", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Suresh ji and told him about the grain dryer, he told me that as of now there is no plan to in"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Rukmani devi garg agro impex limited", "contact": "Mr madan", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "I met Madan ji and told him about Meyer color sorter and packaging machine, he told me that he does "},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Prem and company", "contact": "Mr keshari jain", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "I met Keshari ji and told him about the Meyer color sorter, he told me that right now we do grading,"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Gopal Trading Company", "contact": "Mr sushil soni", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "I met Sushil ji and told him about the grain dryer, packaging machine, compressor and Sortex. He tol"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "mangal dall and oil mill", "contact": "Mr Mahesh", "state": "Rajasthan", "city": "Kota", "existing": "competitors customer", "remarks": "i met mr mahesh ji and told him about color sorter, packaging machine and compressor he told me that"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "mangal udhyog", "contact": "Mr Jagdish", "state": "Rajasthan", "city": "Kota", "existing": "competitors customer", "remarks": "I met mr jagdish ji and told him about color sorter, packaging machine, compressors and he told me t"},
  {"date": "2026-01-24", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "T S Industries", "contact": "Mr Harshul", "state": "Rajasthan", "city": "Kota", "existing": "milltec meyer", "remarks": "I went here but mr harshul is not available here so i called him and told him about color sorter, gr"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Kabra traders", "contact": "Mr brijballabh kabra", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "No new requirement"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "N c rice foods pvt ltd", "contact": "Mr mahesh singhal", "state": "Rajasthan", "city": "Kota", "existing": "Competitor's customer", "remarks": "No new requirement for sortex"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Saini Traders", "contact": "Mr hariprakash saini", "state": "Rajasthan", "city": "Kota", "existing": "No machine", "remarks": "No plan for installed a sortex plant right now"},
  {"date": "2026-01-02", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Madadev industries", "contact": "Ajay Gupta", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "Miltek full plant installed"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Maa Madanpur trading and rice mill", "contact": "Bharat Gupta", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-15", "leadType": "AIR DRYER", "user": "Shivgatulla", "customer": "Maa padkhori traders and rice mill", "contact": "Santosh Singh", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "Miltek color sorter already running since 3y"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Poojar modern rice mill", "contact": "Rakesh Gupta", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "Currently miltek 8 TPH rice plant running since 6years"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Maa aadishakti traders", "contact": "Sunil Patel", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "10 Chute color sorter finalized"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree bala ji Agro industries", "contact": "Santosh Gupta", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "Currently no requirement"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahadev industries", "contact": "Ajay Gupta", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shree Khatu Shyam oil mil", "contact": "Aman Agarwal", "state": "Madhya Pradesh", "city": "Lahar", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Ravatpura sarkar trending company", "contact": "Ramkumar gupta", "state": "Madhya Pradesh", "city": "Lahar", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Mahalaxmi trending company", "contact": "Vikash Gupta", "state": "Madhya Pradesh", "city": "Lahar", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Krishna modern rice mill", "contact": "RAJENDRA MADSIYA", "state": "Uttar Pradesh", "city": "maharajganj", "existing": "COMPETIORR", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Jaa maa Durga rice mill", "contact": "Dharmendar ji", "state": "Uttar Pradesh", "city": "Maharajganj", "existing": "Competitors", "remarks": "Miltek full plant installed"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "baba BAijnath dham rice producer and trading", "contact": "Nirmal", "state": "Uttar Pradesh", "city": "maharajganj", "existing": "com", "remarks": "10 chute color sorter enquiry"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Anyash cold storage", "contact": "Ajay tiwari", "state": "Uttar Pradesh", "city": "Mahewa", "existing": "Construction", "remarks": "Plan air compressor Next month plan"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Bhadauriya cold storage", "contact": "Ram singh", "state": "Uttar Pradesh", "city": "Mahewa", "existing": "Construction", "remarks": "Plan air compressor Next month plan"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Green arms food and vegetables", "contact": "Rishabh Dubey", "state": "Uttar Pradesh", "city": "Mahewa", "existing": "Construction", "remarks": "Plan air compressor Next month plan"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Anjalias camical PLT LTD", "contact": "Anil Yadav", "state": "Uttar Pradesh", "city": "Mahewa", "existing": "Construction", "remarks": "Plan air compressor Next month plan"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Arihant industries", "contact": "Shubham dhariwal", "state": "Madhya Pradesh", "city": "Mandideep", "existing": "No", "remarks": "Planning distoner and magnet for plant"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "R.d industries", "contact": "Mahesh rajput", "state": "Madhya Pradesh", "city": "Mandideep", "existing": "Buhler", "remarks": "Using buhler plant with sortex no requirement in current if they need they contact us not giving con"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Dilnoor majestic basmati rice mill pvt ltd", "contact": "Gourav bhargava", "state": "Madhya Pradesh", "city": "Mandideep industrial area", "existing": "Satake, buhler", "remarks": "No requirement in current using satake plant and machinery and buhler also"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Raam raam multi solved india ltd", "contact": "Ajay Singh", "state": "Madhya Pradesh", "city": "Mandideep industrial area", "existing": "Buhler and satake", "remarks": "Purchase manager on call in office no requirement in current if they want they contact us"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Alayna industries", "contact": "Lokesh panjawani", "state": "Madhya Pradesh", "city": "Mandideep industrial area", "existing": "Satake", "remarks": "No requirement in current using satake plant"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "C.k foods", "contact": "Ramesh sharma", "state": "Madhya Pradesh", "city": "Mandideep, bhopal", "existing": "Satake", "remarks": "No requirement in current customer out of station"},
  {"date": "2026-01-02", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Balaji agro", "contact": "Mr dipesh gulchandani", "state": "Madhya Pradesh", "city": "Mandsaur", "existing": "No machine", "remarks": "I met Dipesh ji and told him about Meyer color sorter and compressor, he told me that there is no ne"},
  {"date": "2026-01-12", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Dhruv rice industries", "contact": "Manish singh", "state": "Uttar Pradesh", "city": "Mau", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-05", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Dhirendra international", "contact": "kamal Abhinav", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "Sortex on dhaniya, final price given, meeting schedule tomorrow at his office."},
  {"date": "2026-01-05", "leadType": "AIR DRYER", "user": "Ashwin Garg", "customer": "Hotwani food ingredients", "contact": "VIjay", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "Sortex on garlic, Final price given for 4 chute smart model along with 20 HP compressor"},
  {"date": "2026-01-07", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Goyal and company", "contact": "Anil Company", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "Sortex on kirana item, meeting schedule tomorrow"},
  {"date": "2026-01-07", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Dhirendra international", "contact": "kamal Abhinav", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "Meeting scheduled tomorrow for order finalisation 12 chute DLT model"},
  {"date": "2026-01-08", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Goyal and company", "contact": "anil", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "Sortex on wheat and other kirana item, owner was not available."},
  {"date": "2026-01-08", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Hotwani food ingredients", "contact": "VIjay", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "feb month order finalised 4 chute smart on garlic along with compressor"},
  {"date": "2026-01-08", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "aman agro", "contact": "Sanjay", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "plan postponed for 3 months, new plant is coming for azwain."},
  {"date": "2026-01-08", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Dhirendra international", "contact": "kamal Abhinav", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "Order finalised 12 chute DLT"},
  {"date": "2026-01-12", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Dhirendra international", "contact": "abhinav", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "PO hard copy colletced from customer with seal and sign."},
  {"date": "2026-01-12", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Goyal and company", "contact": "anil", "state": "Madhya Pradesh", "city": "Neemuch", "existing": "No", "remarks": "10th Jan: Order finalised for 8 chute DLT model. Final price given"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "HOtwani food ingredients", "contact": "Vijay", "state": "Madhya Pradesh", "city": "neemuch", "existing": "No", "remarks": "Sortex on garlic, PO received from customer end, Customer is planning to visit headoffice along with"},
  {"date": "2026-01-27", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "Goyal and company", "contact": "Anil", "state": "Madhya Pradesh", "city": "neemuch", "existing": "No", "remarks": "order finalised for 8 chute smart under EPCG, PO format given, waiting for customer to give final PO"},
  {"date": "2026-01-07", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "NV Enterprises", "contact": "Mr Nakul garg", "state": "Madhya Pradesh", "city": "Nimach", "existing": "No machine", "remarks": "I met Nakul ji, he told me that there is no planning for Sortex right now, right now we are just bui"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Sujay traders", "contact": "Mr manish pamecha", "state": "Madhya Pradesh", "city": "Nimach", "existing": "No machine", "remarks": "I met Manish ji and told him about the Meyer color sorter, he told me that I am planning and the con"},
  {"date": "2026-01-31", "leadType": "COLOR SORTER", "user": "Ujjwal Upadhyay", "customer": "Pankaj kumar Neeraj Kumar", "contact": "Mr pankaj kumar", "state": "Madhya Pradesh", "city": "Nimach", "existing": "No machine", "remarks": "I went here and meet mr pankaj ki and told him about Meyer color sorter so he told me that i have a "},
  {"date": "2026-01-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "R.m overseas", "contact": "Manoj jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-01-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Goyama solor", "contact": "Arpit jain", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New plant Final this month"},
  {"date": "2026-01-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Berry udyog", "contact": "Sanjeev Tyagi", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with purchaser Atlas compressor use No any requirement plan"},
  {"date": "2026-01-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Bsb international", "contact": "Vikash mittal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Biodine global", "contact": "Deepak jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Kirloskar use No any requirement plan"},
  {"date": "2026-01-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "JBN polymers pvt Ltd", "contact": "Amit jindal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Kaeser compressor use Plant add kr rhe hai"},
  {"date": "2026-01-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Mannny ram Goyal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-01-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "M .U textiles", "contact": "Deepak jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Anest iwata user New plant lga rhe hai requirement Time 4. Month"},
  {"date": "2026-01-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Manika plastic", "contact": "Pawan panipati", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Elgi compressor use No any requirement plan"},
  {"date": "2026-01-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Mold tech", "contact": "Govind ji", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with G.M ATLAS Compressor use No any requirement plan"},
  {"date": "2026-01-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Grasim paints", "contact": "Vinay bajaj", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Atlas compressor use of Meeting with elc head No any requirement plan"},
  {"date": "2026-01-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Kesari 8222999792", "contact": "Vikash Sharma", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Cosco compressor use Kaeser compressor ka direct kaeser se order ho gya"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Nahata plastic", "contact": "Granth nahata", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with Munim Question send kr rekhi hai Next month final Krna hai"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Vardhman creation", "contact": "Sanjay jain", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New plant lga rhe 10days fanilaze karna hai"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Jagdish Gupta", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New plant lga rhe hai Requirement time 2 month"},
  {"date": "2026-01-08", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Ganpati cottex", "contact": "Rishabh pruthi", "state": "Haryana", "city": "Panipat", "existing": "Existing members", "remarks": "Meeting with MD Kaeser compressor use No any service issue Requirement time 2 month"},
  {"date": "2026-01-12", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Dev giri overseas", "contact": "Vivek ji", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with GM Ir compressor user Requirement time 2 month"},
  {"date": "2026-01-12", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "H.R overseas", "contact": "Pardeep kakkar", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-12", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Obeetee overseas", "contact": "Ravi kadyan", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-12", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shiv gangay trading", "contact": "Sunil garg", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Locals compressor use No any requirement plan"},
  {"date": "2026-01-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shivalik furnishings", "contact": "Rahul", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-01-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "H b wooltex", "contact": "Ankit goyal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-01-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Madan overseas", "contact": "Amit Madam", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-01-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "R D textiles", "contact": "Rakesh Grover", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shani home", "contact": "Shyanki bansal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New plant aad kr rhe hai Requirement time next month"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Jitendra cottex", "contact": "Sachin jaglan", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New plant lga rhe hai Quotation send kr de hai"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "S.D spinner", "contact": "Ankur bansal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New plant lga rhe hai Requirement 2 months"},
  {"date": "2026-01-15", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "R d overseas", "contact": "Ankit tayal", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New plant Month end families"},
  {"date": "2026-01-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Creative home furnishings", "contact": "Joginder malik", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Local compressor use No any requirement plan"},
  {"date": "2026-01-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Ganpati cottex", "contact": "Rishabh pruthi", "state": "Haryana", "city": "Panipat", "existing": "Existing members", "remarks": "Meeting with MD Kaeser compressor use No any service issue No any requirement plan"},
  {"date": "2026-01-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Ks spinning mills", "contact": "Ks spinning mills", "state": "Haryana", "city": "Panipat", "existing": "Existing members", "remarks": "Meeting with MD Kaeser compressor use Requirement time 2 month"},
  {"date": "2026-01-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Satnam overseas", "contact": "Rajat purthi", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Atlas compressor use No any requirement plan"},
  {"date": "2026-01-19", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Himsager textiles", "contact": "Naresh ji", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Ir compressor user No any requirement plan"},
  {"date": "2026-01-19", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Sunpack industry", "contact": "Rishu gupta", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-19", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shiva floor and furnishing", "contact": "VS chouhan", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc head Elgi compressor use No any requirement plan"},
  {"date": "2026-01-19", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Pankaj sharma", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New plant lga rhe hai Requirement time hai abhi"},
  {"date": "2026-01-20", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Himalaya solar", "contact": "Harsh Aggarwal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-20", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "A K industry", "contact": "Sanjay", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Elgi compressor use No any requirement plan"},
  {"date": "2026-01-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Anuj rathi", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with Munim New plant lga rhe hai"},
  {"date": "2026-01-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Giridhar milk food", "contact": "Mohit bathla", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New plant lga rhe hai Medical ka Requirement time 4 months"},
  {"date": "2026-01-22", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "New uday udyog", "contact": "Kittu kosli", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-22", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Jay jyoti woolen Mills", "contact": "Raj singla", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-22", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Jay shree shyam textiles", "contact": "Sanjay", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Comptech compressor use No any requirement plan"},
  {"date": "2026-01-22", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Prem Cottex", "contact": "Vivek garg", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-01-24", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Home Flore furnishings", "contact": "Naveen Shera", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Ir compressor user No any requirement plan"},
  {"date": "2026-01-24", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "R.G Home furnishings", "contact": "Puneet goyal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New construction Requirement plan 4 months"},
  {"date": "2026-01-27", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Nahata plastic", "contact": "Granth nahata", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Quotation send kr rekhi to Plan next month"},
  {"date": "2026-01-27", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Satnam overseas", "contact": "Rajat purthi", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD ATLAS compressor use No any requirement plan"},
  {"date": "2026-01-27", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Jagdish Gupta", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New construction Requirement time hai ebhi"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "S. K electrical", "contact": "Shivam yadav", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Anest iwata user No any requirement plan"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Uflex", "contact": "Sanjay choudhary", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Munak panipat"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Satyam yarn", "contact": "Sassi bhusan goda", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Ir compressor user No any requirement plan"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Univarsal overseas", "contact": "Pulkit singla", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Kirloskar use No any requirement plan"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "A.P international", "contact": "Naresh", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Elgi and ir compressor user No any requirement plan"},
  {"date": "2026-01-29", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Maharaja texo fab", "contact": "Pappu", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Kaeser and Atlas user No any requirement plan No any service issue"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Jai Laxmi Agro industries", "contact": "Anil Patel", "state": "Uttar Pradesh", "city": "Partawal", "existing": "Competitors", "remarks": "Miltek full plant installed"},
  {"date": "2026-01-03", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Mangalam foods products", "contact": "Rohit Agrawal", "state": "Madhya Pradesh", "city": "Pipariya", "existing": "Satake", "remarks": "Planning 10 chute dlt want final price for finalization"},
  {"date": "2026-01-15", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Tara Devi Agro industries", "contact": "Amit Kumar Singh", "state": "Uttar Pradesh", "city": "Pipraich", "existing": "Competitors", "remarks": "Kinetic Old color sorter running"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Nimai Traders Pvt ltd", "contact": "Madhav Kumar", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor Customer", "remarks": "Competitor Customer"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "A & J Solution Pvt ltd", "contact": "Vikash Gupta", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor Customer", "remarks": "Laser cutting machine user"},
  {"date": "2026-01-28", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Sadashiv Engineers Pvt ltd", "contact": "Mr. Surendra Kushwaha", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor Customer- Atlas Copco, Comptec", "remarks": "General Visit - Comptech 75 HP, Atlas copco user"},
  {"date": "2026-01-30", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "G.g international", "contact": "Malik ji", "state": "Madhya Pradesh", "city": "Raisen", "existing": "Satake", "remarks": "Planning new sortex in April month tarun goyal current using satake sortex and plant"},
  {"date": "2026-01-07", "leadType": "COLOR SORTER", "user": "Ashwin Garg", "customer": "Shree giriraj enterprises", "contact": "Shyam", "state": "Madhya Pradesh", "city": "rajgarh", "existing": "No", "remarks": "PO format given to customer, order finalised 21 lakhs"},
  {"date": "2026-01-06", "leadType": "MCS+MRC", "user": "Ashwin Garg", "customer": "Hitesh Agro", "contact": "Hitesh", "state": "Madhya Pradesh", "city": "Ratlam", "existing": "No", "remarks": "payment follow up for machine coming on 15th Jan"},
  {"date": "2026-01-30", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mangaldeep rice mill", "contact": "Vivek Gupta", "state": "Bihar", "city": "Raxaul", "existing": "Competitors", "remarks": "Miltek full plant installed"},
  {"date": "2026-01-21", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Prakash dal mill", "contact": "Jitendra sahu", "state": "Madhya Pradesh", "city": "Sagar", "existing": "Unique meyer", "remarks": "Our existing customer want service want to replace old sortex in upcoming months"},
  {"date": "2026-01-03", "leadType": "AIR DRYER", "user": "Shivgatulla", "customer": "Shree Laxmi rice mill", "contact": "Makku ji", "state": "Uttar Pradesh", "city": "Sahjanwa", "existing": "Competitors", "remarks": "32 tonne dryer enquiry"},
  {"date": "2026-01-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Shivgatulla", "customer": "Aditya Auto application pvt ltd", "contact": "Shikandar ji", "state": "Uttar Pradesh", "city": "Sahjanwa", "existing": "Competitors", "remarks": "BSD83T AND ASD40T KAESER COMPRESSOR"},
  {"date": "2026-01-13", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Aditya Auto application pvt ltd", "contact": "Shikandar ji", "state": "Uttar Pradesh", "city": "Sahjanwa", "existing": "Competitors", "remarks": "BSD 83 T and ASD 40T kaeser compressor"},
  {"date": "2026-01-24", "leadType": "Kaeser AIR COMPRESSOR", "user": "Shivgatulla", "customer": "Aditya Auto application pvt ltd", "contact": "Shikandar ji", "state": "Uttar Pradesh", "city": "Sahjanwa", "existing": "Competitors", "remarks": "45 kw and 22 kw kaeser compressor enquiry"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Vindhvashini Agro industries pvt ltd", "contact": "Rajendar ji", "state": "Uttar Pradesh", "city": "Shikarpur", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Khatoo shyam rice mill", "contact": "Sandeep ji", "state": "Uttar Pradesh", "city": "Sukrauli", "existing": "Competitors", "remarks": "8 Chute color sorter enquiry"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Ashutosh rice mill", "contact": "Ashutosh", "state": "Uttar Pradesh", "city": "Sukrauli", "existing": "Competitors", "remarks": "7 Chute color sorter enquiry"},
  {"date": "2026-01-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Manti rice mill", "contact": "Rajesh Kumar", "state": "Uttar Pradesh", "city": "Sukrauli", "existing": "Competitors", "remarks": "8 chute color sorter enquiry"},
  {"date": "2026-02-28", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Palak traders", "contact": "Aman khandelwal", "state": "Madhya Pradesh", "city": "Kalapipal", "existing": "New customer", "remarks": "6 chute color sorter machine requirements for wheat"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Brijesh dall mill", "contact": "Brijesh shahu", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Existing customer", "remarks": "Meyer color sorter user"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Vikash industries", "contact": "Vikash ji", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Existing customer", "remarks": "Meyer color sorter user"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Gulab das industries", "contact": "Rajendar shahu", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Euro Green Crop", "contact": "AK Mishra", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Competitors", "remarks": "color sorter enquiry"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Gayatri Traders", "contact": "Rakesh Kumar", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Sanjay kumar rajkumar", "contact": "Sanjay rathore", "state": "Madhya Pradesh", "city": "Sihore", "existing": "Competitor customer", "remarks": "Competitor customer"},
  {"date": "2026-02-28", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Puneet traders", "contact": "Sanjay rathore", "state": "Madhya Pradesh", "city": "Sihore", "existing": "Competitor customer- QED 5 CHUTE", "remarks": "Competitor customer- QED"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Khandelwal enterprises", "contact": "Ravi Khandelwal", "state": "Madhya Pradesh", "city": "Sihore", "existing": "Meyer existing customer", "remarks": "Existing customer- Meyer 5 Chute"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Nandish agri products", "contact": "Arpit Paliwal", "state": "Madhya Pradesh", "city": "Sihore", "existing": "Competitor customer- Unique 4 chute", "remarks": "Competitor customer- unique 4 chute user"},
  {"date": "2026-02-28", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Mahesh chandra laxminarayan sahu", "contact": "Manish sahu", "state": "Madhya Pradesh", "city": "Sihore", "existing": "Competitor customer- Bhuler & miltech", "remarks": "Competitor customer- bhuler& miltech"},
  {"date": "2026-02-27", "leadType": "PACKING MACHINE", "user": "Jaipal", "customer": "Goodwill hybrid seeds (india) pvt ltd", "contact": "Gurjinder Singh", "state": "Haryana", "city": "hisar", "existing": "new", "remarks": "currently customer not using color sorter,"},
  {"date": "2026-02-27", "leadType": "PACKING MACHINE", "user": "Jaipal", "customer": "chaju ram sanjay kumar seeds", "contact": "sanjay ji", "state": "Haryana", "city": "hisar", "existing": "new", "remarks": "currently no new requirement"},
  {"date": "2026-02-27", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "Nowrang enterprises (Gangotri Seeds)", "contact": "Tilakraj ji", "state": "Haryana", "city": "barwala", "existing": "new", "remarks": "seed packing company,"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Groundnut enterprises", "contact": "Sachin gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Exusting", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Rk Bk treders", "contact": "Subhash Gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Sajan trending company", "contact": "Nitu Gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shayam mohan trending company", "contact": "Suneel gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "R.V enterprises", "contact": "Rajeev Gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Laxmi Narayan trending company", "contact": "Gopal gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Maharani Devi treders", "contact": "Kuldeep gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Tata trending company", "contact": "Sanjay tata", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Chhotelal sanjeev kumar treding company", "contact": "Sanjeev Kumar", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Munish chandr ram khilavan", "contact": "Akhilesh gupta", "state": "Uttar Pradesh", "city": "Jalalabad", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Ajmera traders", "contact": "Khandelwal traders/Ajmera traders/neminath traders", "state": "Madhya Pradesh", "city": "Astha", "existing": "Meyer existing customer", "remarks": "Meyer 8 chute user"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Gita Dal mill", "contact": "Shyam jaiswal", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Rakesh dall mill", "contact": "Punit ji", "state": "Uttar Pradesh", "city": "Varanasi", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Shriram trading", "contact": "Jagdish Khandelwal", "state": "Madhya Pradesh", "city": "Astha", "existing": "Competitor customer- QED", "remarks": "Competitor customer- QED sortex"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Bana Vishwanath udhyog", "contact": "Satyam Agrawal", "state": "Uttar Pradesh", "city": "Varansi", "existing": "Existing customer", "remarks": "He is meyer color sorter user"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Sahu traders", "contact": "Rajkumar sahu", "state": "Madhya Pradesh", "city": "Astha", "existing": "Competitor customer- miltec", "remarks": "Planing flour plant, interested in grain dryer and packaging machine"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Shrinath traders", "contact": "Shailendra ji", "state": "Madhya Pradesh", "city": "Astha", "existing": "Competitor customer- QED 5 chute", "remarks": "Competitor customer- QED 5 chute"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Laxmi dal mil", "contact": "Jitendra Sahu", "state": "Madhya Pradesh", "city": "Astha", "existing": "Competitor customer- miltec", "remarks": "Competitor customer- Miltec"},
  {"date": "2026-02-27", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Arihant traders", "contact": "Sachin jain", "state": "Madhya Pradesh", "city": "Astha", "existing": "Competitor customer- QED 5 CHUTE", "remarks": "Competitor customer- QED SORTEX"},
  {"date": "2026-02-26", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "LR Rice Mill", "contact": "Satish ji", "state": "Haryana", "city": "fatehabad", "existing": "compititor", "remarks": ""},
  {"date": "2026-02-26", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "Yunik Seeds", "contact": "Abhey JI", "state": "Haryana", "city": "hisar", "existing": "new", "remarks": "customer enquir about grain dryer"},
  {"date": "2026-02-26", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "Ramdev Rice Mill", "contact": "Sadhu Ram JI", "state": "Haryana", "city": "hisar", "existing": "compititor", "remarks": "customer using mitech color sorter and china mark compressor"},
  {"date": "2026-02-26", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Sourabh enterprises", "contact": "Santosh goshwami", "state": "Madhya Pradesh", "city": "Sonkatch", "existing": "New customer", "remarks": "Planing Color sortex"},
  {"date": "2026-02-26", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "SR enterprises", "contact": "Rohit Jagdish mahajan", "state": "Madhya Pradesh", "city": "Sonkatch", "existing": "New customer", "remarks": "Interested for color sorter for wheat 3tph"},
  {"date": "2026-02-25", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Balaji treders", "contact": "Arun Kumar", "state": "Uttar Pradesh", "city": "Madhovganj", "existing": "Construction", "remarks": "Plan colour sorter"},
  {"date": "2026-02-25", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Balaji treders", "contact": "Ramveer Singh", "state": "Uttar Pradesh", "city": "Madhovganj", "existing": "Construction", "remarks": "Plan colour sorter"},
  {"date": "2026-02-25", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Madhuri refiners pvt ltd", "contact": "Manish sharma", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor customer", "remarks": "General visits"},
  {"date": "2026-02-25", "leadType": "AIR DRYER", "user": "Shivgatulla", "customer": "RKS Agro industries", "contact": "Sahabuddin Ali", "state": "Uttar Pradesh", "city": "Partawal", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-25", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahakal industries", "contact": "Laxmi Prasad jaiswal", "state": "Uttar Pradesh", "city": "Maharajganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-25", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Pae fabcon pvt ltd", "contact": "Rahul gore", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor customer- Elgi compressor", "remarks": "General visits"},
  {"date": "2026-02-25", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shiv modern rice mill", "contact": "Chandrshekhar patel", "state": "Uttar Pradesh", "city": "Mansoorganj", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-25", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Jai bhole industries", "contact": "Manoj Gupta", "state": "Uttar Pradesh", "city": "Bhathat", "existing": "Competitors", "remarks": "Discussion for grain dryer"},
  {"date": "2026-02-25", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Jagdish agri exports pvt ltd", "contact": "Hitesh Patidar", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "New customer", "remarks": "Interested for color sorter for frozen mater"},
  {"date": "2026-02-25", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Maneesh enterprises global pvt ltd", "contact": "Vijay kumar", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Competitor customer"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Ajeet treders", "contact": "Ramkrishn", "state": "Uttar Pradesh", "city": "Allahganj", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Mahaveer treders", "contact": "Grish singh", "state": "Uttar Pradesh", "city": "Allahganj", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Mahaveer treders", "contact": "Ramkumar gupta", "state": "Uttar Pradesh", "city": "Allahganj", "existing": "Construction", "remarks": "Plan colour sorter next month"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree riddhi siddhi Vinayak roller flour mill", "contact": "Rajesh ji", "state": "Madhya Pradesh", "city": "Deori", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Bala ji Agro", "contact": "Prabhakar rai", "state": "Madhya Pradesh", "city": "Deori", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "S.R.K.R foods industries", "contact": "Shivdatta singh", "state": "Uttar Pradesh", "city": "Gauri bazar", "existing": "Competitors", "remarks": "Discussion for color sorter and kaeser compressor"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Amit trading company and rice mill", "contact": "Arvind madhesiya", "state": "Uttar Pradesh", "city": "Gauri bazar", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-24", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Gaurangi foods", "contact": "Juite Lal ji", "state": "Uttar Pradesh", "city": "Chauri chaura", "existing": "Competitors", "remarks": "Discussion for 30 Tonne dryer"},
  {"date": "2026-02-24", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Patanjali foods limited", "contact": "Krati Sharma", "state": "Madhya Pradesh", "city": "Indore", "existing": "New customer", "remarks": "50 ton capacity Grain dryer required."},
  {"date": "2026-02-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree Mata Vaishno Devi Rice mill and traders", "contact": "Brijraj sahahi", "state": "Uttar Pradesh", "city": "Bodarwar", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-23", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Khawaja Garib Nawaz traders", "contact": "Sirajuddin ji", "state": "Uttar Pradesh", "city": "Bodarwar", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-02-21", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Arihant scrap industries", "contact": "Jawahar jain", "state": "Madhya Pradesh", "city": "Sagar", "existing": "Scrap industries", "remarks": "Planning in future no requirement in current"},
  {"date": "2026-02-21", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Vindya sindu industries", "contact": "Deepak jain", "state": "Madhya Pradesh", "city": "Sagar", "existing": "Recycled plastic pets", "remarks": "Planning polimer sortex requirement old sortex not working properly want service to"},
  {"date": "2026-02-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "ABC non woven", "contact": "Sarvesh", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Pistan compressor use 2 pics No any requirement plan"},
  {"date": "2026-02-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Best non woven", "contact": "Amit kadayan", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Pistan compressor use 4 pics No any requirement plan"},
  {"date": "2026-02-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "BMYM industry", "contact": "Narander ji", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Elgi compressor use No any requirement plan"},
  {"date": "2026-02-21", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Preet enterprises", "contact": "Harmeet Singh", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-02-20", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Home linen international", "contact": "Sahil garg", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Compair compressor use No any requirement plan"},
  {"date": "2026-02-20", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Axiflom biotech Pvt Ltd", "contact": "Pitamber", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc Local compressor use No any requirement plan"},
  {"date": "2026-02-20", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Aswani ji", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New plant Requirement time next month"},
  {"date": "2026-02-19", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Mahendra trending company", "contact": "Alok kumar", "state": "Uttar Pradesh", "city": "Bharathna", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-19", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "REFUTURO RECYCLING", "contact": "KALASH CHAND JI", "state": "Haryana", "city": "hisar", "existing": "NEW", "remarks": "VISITED FOR COLOR SORTER AND COMPRESSOR"},
  {"date": "2026-02-19", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "HKC FOOD PRODUCTS", "contact": "VISHAL GARG JI", "state": "Haryana", "city": "hisar", "existing": "NEW", "remarks": "CUSTOMER DEALS IN DRY FRUITS VISITED FOR COLOR SORTER"},
  {"date": "2026-02-19", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "greenline agri seeds", "contact": "MOHIT JI", "state": "Haryana", "city": "hisar", "existing": "compititor", "remarks": "VISITED FOR COLOR SORTER, PACKING MACHINE , COMPRESSOR"},
  {"date": "2026-02-19", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "QUALITY HYBRID SEEDS PVT LTD", "contact": "RAJAT JI", "state": "Haryana", "city": "HISAR", "existing": "new", "remarks": "VISITED FOR PACKING MACHINE, SEED DRYER , COLOR SORTER"},
  {"date": "2026-02-18", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "shee ji super foodpvt ltd", "contact": "niranjan ji", "state": "Haryana", "city": "hisar", "existing": "new", "remarks": "customer enquire about packing machine, currently no requirment"},
  {"date": "2026-02-18", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "om prakssh and sons (uttam products)", "contact": "OMPRAKASH Ji", "state": "Haryana", "city": "hisar", "existing": "new", "remarks": "visited for air compressor and sortex"},
  {"date": "2026-02-17", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Max hospital", "contact": "Jitender deswal", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Anest iwata compressor use No any requirement plan"},
  {"date": "2026-02-17", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Nehal kwatra", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-02-17", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Shiv sharnam", "contact": "Rishab Narang", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Anest iwata compressor use No any requirement plan"},
  {"date": "2026-02-17", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Kshipra foods", "contact": "Nidhi Pathak", "state": "Madhya Pradesh", "city": "Ujjain", "existing": "New customer", "remarks": "Poha manufacturer"},
  {"date": "2026-02-17", "leadType": "AIR DRYER", "user": "Rahul Verma", "customer": "Hira industries", "contact": "Niraj Sanmukhani", "state": "Madhya Pradesh", "city": "Ujjain", "existing": "New customer", "remarks": "Poha industries"},
  {"date": "2026-02-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "AJAY POLYMERS", "contact": "Ramkumar ji", "state": "Haryana", "city": "hisar", "existing": "compititor", "remarks": "VISITED FOR COMPRESSOR"},
  {"date": "2026-02-16", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "Hari-Har Seeds (Shiv Ganga Hybrid Seeds PVT LTD)", "contact": "sumit ji", "state": "Haryana", "city": "hisar", "existing": "competitor", "remarks": "currently customer using stake color color sorter and china mark air compressr"},
  {"date": "2026-02-16", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "S.B traders", "contact": "Shivnath kadhaudhan", "state": "Uttar Pradesh", "city": "Kauriram", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-16", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Purshottam chaurasiya rice mill", "contact": "Purshottam chaurasiya", "state": "Uttar Pradesh", "city": "Kauriram", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-16", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Aayush rice mill and traders", "contact": "Aayush jaiswal", "state": "Uttar Pradesh", "city": "Kauriram", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Ambika textiles", "contact": "Na", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-02-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Finetex industry", "contact": "Parveen", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-02-16", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Kasturi texo fab", "contact": "Sadik", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-02-16", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Parth foods", "contact": "Sumeet Badera", "state": "Madhya Pradesh", "city": "Ujjain", "existing": "New customer", "remarks": "Interested for color sorter - Poha"},
  {"date": "2026-02-16", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Laddha corporation", "contact": "Sanjay laddha", "state": "Madhya Pradesh", "city": "Ujjain", "existing": "Competitor customer", "remarks": "Canvassing agent"},
  {"date": "2026-02-16", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Kuber seeds & Biotech", "contact": "Dharmendra singh Rajput", "state": "Madhya Pradesh", "city": "Ujjai", "existing": "Competitor customer - Qed sortex", "remarks": "Planing for 8 chute sortex for paddy, makka, soyabeen"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "rajendra pvc pipes", "contact": "Ramkumar ji", "state": "Haryana", "city": "hisar", "existing": "competitor", "remarks": "currently the using 5 elgi screw compressor and 3 elgi piston compressor"},
  {"date": "2026-02-14", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "shri ganesh enterprisis", "contact": "tarun ji", "state": "Haryana", "city": "hasi", "existing": "new", "remarks": ""},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Vipin industries", "contact": "Ashok ji", "state": "Madhya Pradesh", "city": "Murena", "existing": "Exusting", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Gupta solvent pvt ltd", "contact": "Rahul Yadav", "state": "Madhya Pradesh", "city": "Murena", "existing": "Exusting", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Bari foods pvt ltd", "contact": "Pankaj Yadav", "state": "Madhya Pradesh", "city": "Murena", "existing": "Exusting", "remarks": "Running colour sorter costumer he say's no problem"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "S.M INDUSTRIES", "contact": "Devendra Kumar", "state": "", "city": "S.M INDUSTRIES", "existing": "Competitor", "remarks": "Plan Air compressor next year"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Abhitex international", "contact": "Shidath sharma", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Kaeser compressor use Requirement time 2 month"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Guru kripa Agro industries", "contact": "Manoj Gupta", "state": "Uttar Pradesh", "city": "Partawal", "existing": "Competitors", "remarks": "10 Chute color sorter enquiry"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Gaba overseas", "contact": "Nasim malik", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Kaeser compressor use No any requirement plan"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Sumit textiles", "contact": "Abhishek Shrivastava", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Anest iwata compressor use No any requirement plan"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Chhajlani packmart pvt ltd", "contact": "Abhishek chhajlani", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Kaeser, mark compressor user"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Royal plastics", "contact": "Hussain Arif", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Competitor customer - Elgi user"},
  {"date": "2026-02-14", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Bhawani polymer", "contact": "Abhishek ji", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Achal agro", "contact": "Dheeraj ji", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Rocket seeds and spices industries llP", "contact": "Omprakash ji", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Sai baba industries", "contact": "Harish ji", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "GDP AGRO", "contact": "Dharm agrwal", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Sheetal industries", "contact": "Depesh wathwani", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Gaurav industrie", "contact": "Santosh ji", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shiva Sakti till mil", "contact": "Shivam gangwani", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Jai laxmi industries", "contact": "Suneel taneja", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-14", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Kailash industries", "contact": "Himanshu taneja", "state": "Madhya Pradesh", "city": "Gwalior", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Fabric cottex", "contact": "Udaipal singh", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc head Atlas compressor use No any requirement plan"},
  {"date": "2026-02-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Sahlesh jain", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New construction Requirement time 4 months"},
  {"date": "2026-02-13", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Sundram non woven", "contact": "Sandeep Garg", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New plant Meeting Monday"},
  {"date": "2026-02-13", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Rungta industries", "contact": "Rajesh rungta", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for kaeser compressor"},
  {"date": "2026-02-13", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Aarvi Trading Company", "contact": "Manoj Agrawal", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor Customer", "remarks": "Interested for 6 chute Sorting machine for wheat"},
  {"date": "2026-02-13", "leadType": "COLOR SORTER", "user": "Rahul Verma", "customer": "Shri Govind Traders", "contact": "Abhishek Agrawal", "state": "Madhya Pradesh", "city": "Indore", "existing": "New Customer", "remarks": "Interested for 6 chute color sorting for kabuli chana"},
  {"date": "2026-02-13", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Maa Durga foods products", "contact": "Gaurav ji", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-13", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Goel dall mill", "contact": "Aakash Goel", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-12", "leadType": "KAESER Micro Filter", "user": "Jaipal", "customer": "AS ENTERPRISES", "contact": "nitin ji", "state": "Haryana", "city": "Sonipat", "existing": "new", "remarks": "customer setting up new plant"},
  {"date": "2026-02-12", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "jk engineering", "contact": "Dilip ji", "state": "Haryana", "city": "Sonipat", "existing": "competitor", "remarks": "customer enquir for 15 hp compressor"},
  {"date": "2026-02-12", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "JAI BALA JI INDUSTRIES", "contact": "Atul ji", "state": "Haryana", "city": "Sonipat", "existing": "NEW", "remarks": "customer enquir for sx 3t"},
  {"date": "2026-02-12", "leadType": "AIR DRYER", "user": "Jaipal", "customer": "Onetail Brands Technologies Private Limited", "contact": "Rajesh ji", "state": "Haryana", "city": "Sonipat", "existing": "competitor", "remarks": "currently customer using atlas copco"},
  {"date": "2026-02-12", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Baba Baijnath rice mill", "contact": "Subhash Chandra jaiswal", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-12", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shiv shakti foods", "contact": "Babloo yadav", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-12", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Har Har Mahadev Agro industries", "contact": "Durgesh Jaiswal", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-12", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Swadam Agrotech Pvt Ltd", "contact": "Amol ji", "state": "Uttar Pradesh", "city": "Gorakhpur", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-11", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Ashtavinayak food products", "contact": "Arun Gupta", "state": "Madhya Pradesh", "city": "Malanpur", "existing": "Competitor", "remarks": "Plan colour air compressor Year"},
  {"date": "2026-02-11", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Pukhraj polymers industries", "contact": "Saurabh Soni", "state": "Madhya Pradesh", "city": "Malanpur", "existing": "Competitor", "remarks": "Plan colour air compressor Year"},
  {"date": "2026-02-11", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Jamna auto industries", "contact": "Mahesh rajput", "state": "Madhya Pradesh", "city": "Malanpur", "existing": "Competitor", "remarks": "Plan colour air compressor Year"},
  {"date": "2026-02-11", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Montage enterprises Pvt Ltd", "contact": "Rajesh Singh", "state": "Madhya Pradesh", "city": "Malanpur", "existing": "Competitor", "remarks": "Plan colour air compressor Year"},
  {"date": "2026-02-11", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Sunbridge food Pvt Ltd", "contact": "Tarun Kumar", "state": "Madhya Pradesh", "city": "Malanpur", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-11", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "TRJ INDUSTRIES PVT LTD", "contact": "Tarun Kumar", "state": "Madhya Pradesh", "city": "Malanpur", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-10", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shee foods pvt ltd", "contact": "Sayeed ji", "state": "Bihar", "city": "Darbhanga", "existing": "Competitors", "remarks": "GK-Call not picked"},
  {"date": "2026-02-10", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Makhanoz foods pvt ltd", "contact": "Vipul chaudhary", "state": "Bihar", "city": "Darbhanga", "existing": "Competitors", "remarks": "Discussion for belt color sorter"},
  {"date": "2026-02-10", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Makhayo foods pvt ltd", "contact": "Rachit sarogi", "state": "Bihar", "city": "Darbhanga", "existing": "Competitors", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-10", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Greenfield makhana processing", "contact": "Aayush Kumar", "state": "Bihar", "city": "Darbhanga", "existing": "Competitors", "remarks": "Discussion for belt color sorter"},
  {"date": "2026-02-10", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Bholenath food", "contact": "Rakesh ji", "state": "Haryana", "city": "Panipat", "existing": "Existing members", "remarks": "Meeting with GM Kaeser compressor use No any requirement plan"},
  {"date": "2026-02-10", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "JMD supe tech", "contact": "Naveen gotam", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with MD New construction Requirement time hai"},
  {"date": "2026-02-10", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Mahalaxmi impex", "contact": "Umesh sabhrwal", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "Meeting with elc New construction Requirement time 2 month"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Arvind Kumar", "customer": "B P Frozen Foods Pvt Ltd", "contact": ".", "state": "Uttarakhand", "city": "Kashipur", "existing": "New customer", "remarks": "Discussion done regarding color sorter machine. He will update shortly"},
  {"date": "2026-02-09", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Tulshi ram and company", "contact": "Himanshu", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-09", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Maa bala sundri overseas", "contact": "Ashish mittal", "state": "Haryana", "city": "Panipat", "existing": "Existing members", "remarks": "Meeting with MD Kaeser compressor use No any requirement plan No any issue"},
  {"date": "2026-02-09", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "RSVP green energy", "contact": "Sanyan Arora", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-09", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Alfa gren", "contact": "Sarthak singla", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD New construction Requirement time 2 month"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Madhubani Makhana pvt ltd", "contact": "Harish Kumar", "state": "Bihar", "city": "Madhubani", "existing": "Competitors", "remarks": "GK-If there will be any requirement he will connect"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Makhana Maa mahakali India pvt ltd", "contact": "Amit Kumar", "state": "Bihar", "city": "Madhubani", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mithila Makhana pvt ltd", "contact": "Gurunand Sahani", "state": "Bihar", "city": "Madhubani", "existing": "Competitors", "remarks": "GK-Call not picked"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Pavitram foods pvt ltd", "contact": "Nikhil ji", "state": "Bihar", "city": "Madhubani", "existing": "Competitors", "remarks": "Discussion for belt color sorter"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shree Radha bhawani Makhana udhyog", "contact": "Kanhaiya ji", "state": "Bihar", "city": "Madhubani", "existing": "Competitors", "remarks": "Discussion for color sorter"},
  {"date": "2026-02-09", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mithila naturals", "contact": "Manish Aanand", "state": "Bihar", "city": "Madhubani", "existing": "Competitors", "remarks": "Discussion for belt color sorter"},
  {"date": "2026-02-07", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Sadan singh trending company", "contact": "Kamlesh Kumar", "state": "Uttar Pradesh", "city": "Bharthana", "existing": "Competitor", "remarks": "Plan grain drayer next Year"},
  {"date": "2026-02-07", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Anil Kuma ashok kumar treding company", "contact": "Anmol tripathi", "state": "Uttar Pradesh", "city": "Bharthana", "existing": "Competitor", "remarks": "Plan grain drayer next Year"},
  {"date": "2026-02-07", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Gulab Singh ashok kumar treding company", "contact": "Ashok Kumar", "state": "Uttar Pradesh", "city": "Bharthana", "existing": "Competitor", "remarks": "Plan grain drayer next Year"},
  {"date": "2026-02-07", "leadType": "Grain Dryer", "user": "Himanshu Nagar", "customer": "Atul treders", "contact": "Atul Kumar", "state": "Uttar Pradesh", "city": "Bharthana", "existing": "Competitor", "remarks": "Plan grain drayer next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Shre Ram plastics", "contact": "Pramod agrawal", "state": "Madhya Pradesh", "city": "Murena", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Mahesh group", "contact": "Ashok Sharma", "state": "Madhya Pradesh", "city": "Murena", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Krhal food products", "contact": "Rajkumar", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "GK-call not picked"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "S.S biofuel", "contact": "Avanish rajput", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan Air compressor next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Raghav biofuel industries", "contact": "Amit Singh", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan Air compressor next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Shre bhagwan oil mil", "contact": "Mukesh YADAV", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan Air compressor next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "H.S edible oil pvt ltd", "contact": "Gaurav agrawal", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan Air compressor next Year"},
  {"date": "2026-02-07", "leadType": "PACKING MACHINE", "user": "Himanshu Nagar", "customer": "Mayurvan foods pvt ltd", "contact": "Yes mangal", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Himanshu Nagar", "customer": "Mangal food products", "contact": "Deepak Agrawal", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Shree Krishna adibel oil", "contact": "Manoj dandotiya", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "R.P OVERSEAS", "contact": "Pratap Chauhan", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan colour sorter next yaar"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Kishore kripa cold storage", "contact": "Nikhil ji", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan colour sorter next yaar"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Kailadevi floor mil", "contact": "Dipak gupta", "state": "Madhya Pradesh", "city": "Murena", "existing": "Construction", "remarks": "Plan colour sorter next yaar"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Devisha cotspin", "contact": "Gorav bathla", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Local compressor use No any requirement plan"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "JRK wollen", "contact": "Ankur jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Ir compressor user No any requirement plan"},
  {"date": "2026-02-07", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Kapoor wollltex", "contact": "Ashok Kapoor", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Ir compressor user No any requirement plan"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Bhagwati dal mill", "contact": "Vinod ji", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "Quidy color sorter user"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Satkar industries", "contact": "Sanjit ji", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Sagar industries", "contact": "Jawahar ji", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Shee Ram dal mill", "contact": "Vivek ji", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "Color sorter enquiry"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "BDM sons", "contact": "Rajesh Kumar", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Ganesh dall mill", "contact": "Sonu Kumar", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "GK-Call not picked"},
  {"date": "2026-02-07", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Mahi enterprises", "contact": "Sanjay ji", "state": "Bihar", "city": "Barh", "existing": "Competitors", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-06", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Aaradhya overseas", "contact": "Na", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-06", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "DHLS carpet", "contact": "Dinesh Nagpal", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "GK-Call not picked"},
  {"date": "2026-02-05", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Shree madhav foods agro", "contact": "Anup maheshwari", "state": "Madhya Pradesh", "city": "Pipariya", "existing": "Mark", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-05", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Sidhi vinayak foods", "contact": "Ramesh Prajapati", "state": "Madhya Pradesh", "city": "Pipariya", "existing": "Unique", "remarks": "GK-No requiremnet yet"},
  {"date": "2026-02-05", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Hindustan icecream food", "contact": "Mayank mishra", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with elc head Elgi compressor use No any requirement plan"},
  {"date": "2026-02-05", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Adani", "contact": "Shivam rai", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-05", "leadType": "COLOR SORTER", "user": "Shivgatulla", "customer": "Jai bhole enterprises", "contact": "Vinod verma", "state": "Uttar Pradesh", "city": "Kushinagar", "existing": "Competitors", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-04", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "Jai Maruti foods", "contact": "Aman malhotra", "state": "Madhya Pradesh", "city": "Pipariya", "existing": "Satake and buhler", "remarks": "Using buhler and satake sortex and plant no requirement in current"},
  {"date": "2026-02-04", "leadType": "COLOR SORTER", "user": "Rahul Mahant", "customer": "J.p food's", "contact": "Shivam Sharma", "state": "Madhya Pradesh", "city": "Pipariya", "existing": "New plant", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-04", "leadType": "COLOR SORTER", "user": "Arvind Kumar", "customer": "Green Frozen", "contact": "Mr. Harinarayan Jindal", "state": "Chhattisgarh", "city": "Bilaspur", "existing": "New customer", "remarks": "Running Frozen peas processing plant and started from current season. He will update as per future p"},
  {"date": "2026-02-04", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "G.J home furnishings", "contact": "Abhishek jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-04", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Sheen Tex india", "contact": "Arun Sharma", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-04", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Navkar international", "contact": "Akshay jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "Meeting with MD Elgi compressor use No any requirement plan"},
  {"date": "2026-02-04", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Kalpna industries", "contact": "Mr. Sanjay kathnawal", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer", "remarks": "Competitor customer"},
  {"date": "2026-02-04", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "BC petrochem", "contact": "Mr. Keshav ji", "state": "Madhya Pradesh", "city": "Indore", "existing": "Competitor customer - Ir compressor", "remarks": "Competitor customer"},
  {"date": "2026-02-03", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "R.B OIL INDUSTRIES", "contact": "GANSHAYAM JI", "state": "Madhya Pradesh", "city": "Porsa", "existing": "Construction", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-03", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Manish Oil mil", "contact": "Mohan agrawal", "state": "Madhya Pradesh", "city": "Porsa", "existing": "Construction", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-03", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Aman bandil trending company", "contact": "Gaurav kumar", "state": "Madhya Pradesh", "city": "Porsa", "existing": "Construction", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-03", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Balaji green energy", "contact": "Amit Singh tomer", "state": "Madhya Pradesh", "city": "Porsa", "existing": "Construction", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Radhey krishna textiles", "contact": "Anantram khurana", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Golden spuntex", "contact": "Sandeep gupta", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Na", "contact": "Dinesh khurana", "state": "Haryana", "city": "Panipat", "existing": "Na", "remarks": "GK-REQUIREMENT AFTER SESSION"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Gyan rachna furnishings", "contact": "Lavesh jain", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Him technoforge ltd", "contact": "Pradeep sharma", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor customer", "remarks": "Competitor customer- Atlas copco, IR"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Rane automotive", "contact": "Mr. Rupesh Lodwal", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Existing customer- kaeser compressor", "remarks": "495 CFM planning"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Spm Autocomp pvt ltd", "contact": "Mr. Ram kumawat", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Existing user - Kaeser compressor", "remarks": "Kaeser user"},
  {"date": "2026-02-03", "leadType": "Kaeser AIR COMPRESSOR", "user": "Rahul Verma", "customer": "Kach motors pvt ltd", "contact": "Mr. Pratik jain", "state": "Madhya Pradesh", "city": "Pithampur", "existing": "Competitor customer", "remarks": "Competitor customer IR, Elgi"},
  {"date": "2026-02-02", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "MAHALAXMI ENTERPRISES", "contact": "RAKESH GARG JI", "state": "Haryana", "city": "HISAR", "existing": "UNIQUE CARTER", "remarks": "Not Connected"},
  {"date": "2026-02-02", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Jai girraj bio energy", "contact": "JP chaudhary", "state": "Madhya Pradesh", "city": "Gohad", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-02", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "SHREE SHYAM UDYOG", "contact": "SACHIN JI", "state": "Haryana", "city": "Hisar", "existing": "MEYER AND BHULER", "remarks": "AS DISCUSED WITH CUSTOMER HE WILLING TO BUY OLD GRAIN DRYER"},
  {"date": "2026-02-02", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Chaukhelal matadim rice mil pvt ltd", "contact": "Subhash Chand", "state": "Madhya Pradesh", "city": "Gohad", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-02", "leadType": "COLOR SORTER", "user": "Himanshu Nagar", "customer": "Pahariya rice mil pvt Ltd", "contact": "Vivek Sharma", "state": "Madhya Pradesh", "city": "Gohad", "existing": "Competitor", "remarks": "Plan colour sorter next Year"},
  {"date": "2026-02-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "Bharat textiles", "contact": "Naveen bhala", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-02", "leadType": "Kaeser AIR COMPRESSOR", "user": "Govind", "customer": "M.V cottex", "contact": "Sonu", "state": "Haryana", "city": "Panipat", "existing": "Competitor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-01", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "SAWARIYA INDUSTRIES", "contact": "KRISHAN GOYAL JI", "state": "Rajasthan", "city": "SADULPUR", "existing": "NEW", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-01", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "ANPURNA FLOUR MILL", "contact": "RAMAKANT GOYAL JI", "state": "Rajasthan", "city": "SADULPUR", "existing": "NEW", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-01", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "SAWARIYA AGRO PRODUSTS PVT LTD", "contact": "VIKASH JI", "state": "Rajasthan", "city": "SADULPUR", "existing": "compititor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-01", "leadType": "MCS with KAESER Compressor", "user": "Jaipal", "customer": "SHREE RAM FOOD INDUSTRIES", "contact": "MOHIT GOYAL JI", "state": "Rajasthan", "city": "SADULPUR", "existing": "compititor", "remarks": "GK-No requirement yet"},
  {"date": "2026-02-01", "leadType": "Kaeser AIR COMPRESSOR", "user": "Jaipal", "customer": "SHAKTI VARDHAK HYBRID SEEDS PVT LTD", "contact": "KRISHAN JI", "state": "Haryana", "city": "Hisar", "existing": "compititor", "remarks": "GK-Asking for qutation"}
];

const LEADS = [
  {"date": "2026-01-15", "uqn": "KC/NICPL0G000/2026/2930", "source": "By Meeting", "user": "Govind", "customer": "M/s JITENDRA COTTEX", "contact": "Mr .Sachin jaglan", "mobile": "M: +91-9112000063", "remarks": "Need- 30hp Compressor", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-15", "uqn": "M001/NICPL0S001/2026/2929", "source": "Calling", "user": "Shivgatulla", "customer": "Sudipta hati", "contact": "Sudipta hati", "mobile": "M: 8293916079", "remarks": "Quotation send and he is finalized in Last week of January month", "state": "West Bengal", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-15", "uqn": "M001/NICPL0S001/2026/2928", "source": "Calling", "user": "Shivgatulla", "customer": "Shivam Modi", "contact": "Shivam Modi", "mobile": "M: 9830505172", "remarks": "Quotation send he is planning in Jan month current busy somewhere", "state": "West Bengal", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-15", "uqn": "CS/ERGYT/2026/2927", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "GDP AGRO AND FOOD PRODUCTS PRIVATE LIMITED", "contact": "Mr. Dharam Aggarwal Ji", "mobile": "M: +91-9827259553", "remarks": "Using Kaeser Air Compressor and Devan Color Sorter, Now Need Meyer Color Sorter for Peanuts", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-14", "uqn": "CS/MU/2026/2926", "source": "By Meeting", "user": "Murli dar sukla", "customer": "JAY AMBEY PULSES", "contact": "Sipoliya ji", "mobile": "M: +91-7355020465", "remarks": "he want to purchase 8 chute meyer color sorter.", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-14", "uqn": "GD/MU/2026/2925", "source": "By Call", "user": "Murli dar sukla", "customer": "Kamlesh Agrawal", "contact": "Kamlesh Agrawal", "mobile": "M: +919131990750-", "remarks": "HE WANT TO PURCHASE 8 CHUTE MEYR COLOR SORTER.", "state": "Madhya Pradesh", "leadType": "Grain Dryer", "stage": "New"},
  {"date": "2026-01-14", "uqn": "M001/NICP0A0008/2026/2924", "source": "By Meeting", "user": "Ashwin Garg", "customer": "Shree Kumawat Foods", "contact": "Devraj Kumawat", "mobile": "M: 97528 90448", "remarks": "Sortex on chickpeas", "state": "Madhya Pradesh", "leadType": "MCS+MRC", "stage": "Follow up"},
  {"date": "2026-01-13", "uqn": "CS/DEMORM0002/2026/2922", "source": "Calling", "user": "Rahul Mahant", "customer": "Chetan khandelwal", "contact": "Chetan khandelwal", "mobile": "M: 9425432085", "remarks": "Today visit to customer plan has been postponed according to customer for 8 chute sortex", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-13", "uqn": "CS/DEMORM0002/2026/2921", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Keshar enterprises", "contact": "Rahul Singh", "mobile": "M: +91-900900792", "remarks": "Planning 5 chute sortex on multi commodity major wheat under discussion on price", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-13", "uqn": "CS/NICUU001/2026/2920", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Mr akash mittal", "contact": "Mr akash mittal", "mobile": "M: 7415388948", "remarks": "he told me that you tell me the approximate price, on that basis we will discuss further after looki", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-13", "uqn": "M001/NICP0A0008/2026/2918", "source": "By Meeting", "user": "Ashwin Garg", "customer": "GOYAL AND CO NEEMACH", "contact": "Anil Kumar Goyal", "mobile": "M: +91-9425106482", "remarks": "Final PO format given for print on their letter pad along with seal and sign.", "state": "Madhya Pradesh", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-10", "uqn": "CS/ERGYT/2026/2917", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "JAGDAMBA ENTERPRISES", "contact": "Mr. Sunil Kumar Agarwal", "mobile": "M: +91-9784088462", "remarks": "Need Color Sorter For Groundnuts", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-10", "uqn": "CS/DEMORM0002/2026/2916", "source": "Calling", "user": "Rahul Mahant", "customer": "SIDDHANT AGRWAL", "contact": "SIDDHANT AGRWAL", "mobile": "M: 9993028865", "remarks": "Intrested in 7 chute sortex planning soon want machine in 2 month and want quatation today", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-10", "uqn": "CS/MU/2026/2915", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Atharv Foods", "contact": "Atharv Foods", "mobile": "M: +91-9981402195", "remarks": "quotation send", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-10", "uqn": "GD/NICPL0H000/2026/2914", "source": "By Meeting", "user": "Himanshu Nagar", "customer": "M/S. RAJASHREE TRADING COMPANY.", "contact": "Mr. Shahin Ji", "mobile": "M: +91-73075 11578", "remarks": "15T", "state": "Uttar Pradesh", "leadType": "Grain Dryer", "stage": "Quotation Send"},
  {"date": "2026-01-10", "uqn": "CS/ERGYT/2026/2913", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "KRISHNAVANDAN FARMER PRODUCER COMPANY LIMITED", "contact": "Mr. Swapnil Patil", "mobile": "M: +91-7219207788", "remarks": "Need 2NOS Color Sorter and 2NOS Air Compressors", "state": "Maharashtra", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-09", "uqn": "CS/NICUU001/2026/2912", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "SDJ INDUSTRIES PRIVATE LIMITED", "contact": "Mr Kunal dagle", "mobile": "M: 8109112114", "remarks": "RD - QUOTATION SEND", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-08", "uqn": "CS/NICUU001/2026/2911", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Mr Abhinav", "contact": "Mr Abhinav", "mobile": "M: 9425923127", "remarks": "Here we go to finalize the order.Here we went to finalize the order and met Abhinav ji, he told us t", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-07", "uqn": "KC/MAHESH/2026/2909", "source": "By Meeting", "user": "Mahesh Chandra", "customer": "Rhine Solar Limited", "contact": "Mr. Shiv Gupta Ji", "mobile": "M: 9811078868", "remarks": "Quotation Send: But Now Plan Postponed", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-07", "uqn": "CS/MU/2026/2906", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Vitthal Dall Mill", "contact": "Mr. Manish baithi", "mobile": "M: +91-9922429700", "remarks": "quotation send", "state": "Maharashtra", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-07", "uqn": "M001/MU/2026/2905", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Shree Shakti Motors", "contact": "Mr. Mahaveer ji", "mobile": "M: +91-9826152084", "remarks": "quotation send", "state": "Uttar Pradesh", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-06", "uqn": "M001/MAHESH/2026/2903", "source": "By Meeting", "user": "Mahesh Chandra", "customer": "M/s- Dayal Seeds Pvt. Ltd", "contact": "Mr. Vivek JI", "mobile": "M: +91-99174 27070", "remarks": "Quotation Send", "state": "Uttar Pradesh", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-06", "uqn": "KC/NIC0D01001/2026/2902", "source": "By Call", "user": "Deepesh", "customer": "M/s -Shubh Spinning Mills", "contact": "Mr. Sanjay ji", "mobile": "M: +91-9254158660", "remarks": "RD-QUOTATION SENT BY DEEPESH SIR ON 10 JAN 2025 (ASD40T-8 Bar (30hp/22kw)", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-06", "uqn": "CS/VK/2026/2901", "source": "By Meeting", "user": "Vinod", "customer": "Sri Mahadeo Industries", "contact": "Mr.Pankaj Agarwal", "mobile": "M: 9415148351", "remarks": "Requirement sortex in this year", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-05", "uqn": "KC/ERGYT/2026/2900", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "VKC NUTS PRIVATE LIMITED", "contact": "Mr. Vikash Mor", "mobile": "M: +91-9813626726", "remarks": "RD-UQN NUMBER - KC/007/2026/0100015", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-01-03", "uqn": "MCK001/DEMORM0002/2026/2899", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Neeb foods pvt LTD", "contact": "Vipin patel", "mobile": "M: +91-8269002730", "remarks": "Still on figuring price of compressor details has been sent apply UQN generate", "state": "Madhya Pradesh", "leadType": "MCS with KAESER Compressor", "stage": "Hot Lead"},
  {"date": "2026-01-03", "uqn": "CS/NICUU001/2026/2898", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Kanchan Agro", "contact": "Mr. Sanjay Jain", "mobile": "M: 7000460506", "remarks": "quotation send", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-03", "uqn": "M001/NICP0A0008/2026/2897", "source": "Calling", "user": "Ashwin Garg", "customer": "Shaleen Khandelwal", "contact": "Shaleen Khandelwal", "mobile": "M: 9826393201", "remarks": "PO received but advance payment not done from customer side.", "state": "Madhya Pradesh", "leadType": "MCS+MRC", "stage": "Pending"},
  {"date": "2026-01-02", "uqn": "CS/NICUU001/2026/2896", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Mr Kushal doshi", "contact": "Mr Kushal doshi", "mobile": "M: 9425923052", "remarks": "he told me that prakashchandra mannalal ji's sortex should be finalized, after that i will finalize ", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Pending"},
  {"date": "2026-01-02", "uqn": "CS/NICP0A0010/2026/2894", "source": "By Meeting", "user": "Arvind Kumar", "customer": "Anand Foods", "contact": "Owner", "mobile": "M: +91-9557511111", "remarks": "Deal under discussion", "state": "Chhattisgarh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-02", "uqn": "CS/NICP0A0010/2026/2893", "source": "By Meeting", "user": "Arvind Kumar", "customer": "Shyam Frozen Food", "contact": "Mr. Saurabh Bansal", "mobile": "M: +91-9756555534", "remarks": "Deal under discussion", "state": "Uttarakhand", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-02", "uqn": "KC/NIC0D01001/2026/2892", "source": "By Call", "user": "Deepesh", "customer": "SARVESHWAR OVERSEAS LIMITED", "contact": "Mr.Dev Raj", "mobile": "M: +91-9596797432", "remarks": "BSD83T+F83KE+1500 Ltr tank", "state": "Jammu and Kashmir", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-02", "uqn": "KC/NIC0D01001/2026/2891", "source": "By Call", "user": "Deepesh", "customer": "M/s-Shrinath Ji Riceland Pvt.Ltd.", "contact": "Mr.Naresh Garg", "mobile": "M: +91-9518084000", "remarks": "BSD-83T+F83KE+1500Ltr Tank", "state": "Madhya Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-02", "uqn": "KC/RB/2026/2890", "source": "Google Adwords", "user": "RAHUL", "customer": "SHAKTI VARDHAK HYBRID SEEDS PVT LTD.", "contact": "MR. RAVI JI.", "mobile": "M: 9416060018", "remarks": "Need 60HP Kaeser Compressor with Full Package", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-01-30", "uqn": "PM/NICUU001/2026/2978", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "TOLA RAM SATYA DEV AGRO PRIVATE LIMITED.", "contact": "Mr Manoj Katariya", "mobile": "M: 9414188083", "remarks": "RD-quotation has been sent to Mr. Ujjwal Upadhyay.", "state": "Rajasthan", "leadType": "PACKING MACHINE", "stage": "Quotation Send"},
  {"date": "2026-01-29", "uqn": "KC/02021/2026/2977", "source": "Calling", "user": "Jaipal", "customer": "RAHUL SHARMA JI", "contact": "RAHUL SHARMA JI", "mobile": "M: 9811287550", "remarks": "REQUIR QUATATION", "state": "Delhi", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-29", "uqn": "CS/DEMORM0002/2026/2976", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Vardhman dall milll", "contact": "Rahul jain", "mobile": "M: 9893480631", "remarks": "Planning 6 chute sortex with 30 hp compressor want price and quatation", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-29", "uqn": "CS/ERGYT/2026/2975", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "Gayatri Gruh Udhyog", "contact": "Mr. Vaibhav Patel", "mobile": "M: +91-9099947565", "remarks": "New Company Need Color Sorter for Seeds", "state": "Gujarat", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-29", "uqn": "CS/ERGYT/2026/2974", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "M/S RAMESHWARAM RICE MILLS PVT. LTD.", "contact": "Mr. Dharmender Sharma", "mobile": "M: +91-8607500660", "remarks": "Need Color Sorter for Rice", "state": "Bihar", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-29", "uqn": "KC/ERGYT/2026/2973", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "TIGRIS MOBILITY PRIVATE LIMITED", "contact": "Mr. Dhruv Dev", "mobile": "M: +91-9818239592", "remarks": "Need Kaeser Compressor but we already shared quotation in 2024", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-29", "uqn": "GD/ERGYT/2026/2972", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "BREW BUDDY BEVCO PRIVATE LIMITED", "contact": "Mr. Aditya Nagri Ji", "mobile": "M: +91-9971699996", "remarks": "Need Grain Dryer for Maize", "state": "Delhi", "leadType": "Grain Dryer", "stage": "Follow up"},
  {"date": "2026-01-29", "uqn": "GD/ERGYT/2026/2971", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "SHIVA ENT UDYOG", "contact": "Mr. Mohit Somani Ji", "mobile": "M: +919917585013-", "remarks": "Need Grain Dryer for Maize", "state": "Uttar Pradesh", "leadType": "Grain Dryer", "stage": "Follow up"},
  {"date": "2026-01-29", "uqn": "M001/NICP0A0008/2026/2970", "source": "By Meeting", "user": "Ashwin Garg", "customer": "RATANLAL RAMNIWAS AND COMPANY", "contact": "Varun Mangal", "mobile": "M: +91-9425063835", "remarks": "6 chute DLT model for chickpeas. waiting for grain expo", "state": "Madhya Pradesh", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-29", "uqn": "M001/NICP0A0008/2026/2969", "source": "By Meeting", "user": "Ashwin Garg", "customer": "Saifee Food Products", "contact": "Hussain", "mobile": "M: +91-99742 35852", "remarks": "Smart 6 and 8 chute quote sent to customer along with compressor", "state": "Gujarat", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-01-29", "uqn": "KC/02021/2026/2968", "source": "By Visit", "user": "Jaipal", "customer": "OM SAI AUTO ENTERPRISES", "contact": "MR. NIKHIL AGGARWAL", "mobile": "M: +91-9899140019", "remarks": "RD- QUOTATION SEND 1. Screw Air Compressor With (IE3 Motor) AS4-34 -8.5Bar (18.5KW/24.80HP) Micro fi", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-28", "uqn": "CS/NICP0A0010/2026/2967", "source": "Calling", "user": "Arvind Kumar", "customer": "Grandeur Agrotech Pvt Ltd", "contact": "Mr. Anupam Ji", "mobile": "M: +91-9140324007", "remarks": "He will plan to visit SPT or Madhusudan for seeing the machine performance", "state": "Uttarakhand", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-28", "uqn": "KC/02021/2026/2966", "source": "Calling", "user": "Jaipal", "customer": "SANJAY CHOUDHARY", "contact": "SANJAY CHOUDHARY", "mobile": "M: 9215220000", "remarks": "connected", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-28", "uqn": "KC/02021/2026/2965", "source": "Calling", "user": "Jaipal", "customer": "Harsh malik ji", "contact": "Harsh malik ji", "mobile": "M: 9416030777", "remarks": "not connected", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-28", "uqn": "KC/02021/2026/2964", "source": "Calling", "user": "Jaipal", "customer": "JP Sharma", "contact": "JP Sharma", "mobile": "M: 9811287590", "remarks": "Interested", "state": "Delhi", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-28", "uqn": "MRC/NICP0A0010/2026/2963", "source": "Calling", "user": "Arvind Kumar", "customer": "Purvanchal Agro Industries", "contact": "Mr. Ajay Singh", "mobile": "M: +91-9670300341", "remarks": "Deal under discussion", "state": "Uttar Pradesh", "leadType": "MRC AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-27", "uqn": "CS/NICP0A0008/2026/2962", "source": "By Meeting", "user": "Ashwin Garg", "customer": "Ambawala Industries", "contact": "Salim", "mobile": "M: +91- 9425925984", "remarks": "4 chute smart model along with 20 HP compressor", "state": "Gujarat", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-27", "uqn": "CS/NICP0A0010/2026/2961", "source": "EXPO", "user": "Arvind Kumar", "customer": "Maa Impax", "contact": "Maa Impax", "mobile": "M: +91-9826010399", "remarks": "Discussion done regarding color sorter machine for Almond sorting. He will confirm order status in l", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-25", "uqn": "CS/NICP0A0010/2026/2960", "source": "EXPO", "user": "Arvind Kumar", "customer": "Mahan Mehr Darys Co.", "contact": "Mr. Amin Sedighi", "mobile": "M: +98- 9120823093", "remarks": "Discussion done regarding color sorter machine for removing kernel from pistachios. I sent a demand ", "state": "Iran", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-24", "uqn": "KC/NICPLR001/2026/2959", "source": "By Visit", "user": "Rahul Verma", "customer": "Cureza health care pvt ltd", "contact": "Jeevan prajapati", "mobile": "M: +91-9826397709", "remarks": "Kaeser compressor Capacity - 200 CFM Pressure - 7.5 bar Receiver tank - 1000 ltr With dryer and pre ", "state": "Madhya Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-24", "uqn": "KC/NICP0A0010/2026/2957", "source": "EXPO", "user": "Arvind Kumar", "customer": "SHREERAMJI DEAL TRADES PRIVATE LIMITED", "contact": "Mr. Harshvardhan Kedia", "mobile": "M: +91-96741 66666", "remarks": "Call not received", "state": "West Bengal", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-01-23", "uqn": "CS/NICPLR001/2026/2953", "source": "By Visit", "user": "Rahul Verma", "customer": "Jai Ranjeet traders", "contact": "Mr. Girish lallani", "mobile": "M: +919827330562-", "remarks": "Meyer Color Sorter", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-23", "uqn": "GD/NICPLR001/2026/2952", "source": "By Visit", "user": "Rahul Verma", "customer": "Vinayak Enterprises", "contact": "Mr. Ayush Dubey", "mobile": "M: +91-8817599997", "remarks": "Need Kaeser Booster N-351 Required pressure 35 bar", "state": "Madhya Pradesh", "leadType": "Grain Dryer", "stage": "New"},
  {"date": "2026-01-22", "uqn": "AD/NICPL0S001/2026/2951", "source": "Calling", "user": "Shivgatulla", "customer": "Juganoo Singh", "contact": "Juganoo Singh", "mobile": "M: 94518 80351", "remarks": "GK-N", "state": "Uttar Pradesh", "leadType": "AIR DRYER", "stage": "New"},
  {"date": "2026-01-22", "uqn": "CS/DEMORM0002/2026/2949", "source": "Calling", "user": "Rahul Mahant", "customer": "kailash sahu", "contact": "kailash sahu", "mobile": "M: 9415179755", "remarks": "Planning to visit tomorrow our existing plant for watch running sortex machine then he take decision", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-22", "uqn": "CS/NICP0A0010/2026/2948", "source": "By Visit", "user": "Arvind Kumar", "customer": "Ambuj Agro Industries", "contact": "Mr. Ambuj Ji", "mobile": "M: +91-8791282325", "remarks": "I am in touch with him and he will update as per future plan", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-21", "uqn": "CS/DEMORM0002/2026/2947", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Adinath trader", "contact": "Monu jain", "mobile": "M: +91-9752323541", "remarks": "Plan has been postponed according to customer for some month's", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-21", "uqn": "CS/NICP0A0010/2026/2946", "source": "By Visit", "user": "Arvind Kumar", "customer": "Aahs Foods", "contact": "Mr. Sachin Gupta Ji", "mobile": "M: +917017578881", "remarks": "He is highly interested and arranging meeting soon with Rahul Sir", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-01-21", "uqn": "CS/MU/2026/2942", "source": "By Meeting", "user": "Murli dar sukla", "customer": "sajal Traders", "contact": "sajal Traders", "mobile": "M: +91-9425035210", "remarks": "HE WANT TO PURCHASE 6 CHUTE MEYER COLOR SORTER.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-01-20", "uqn": "CS/DEMORM0002/2026/2941", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Dhanraj industries", "contact": "Gaurav rajpal", "mobile": "M: +91-9329419700", "remarks": "Busy on another call", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-20", "uqn": "CS/MU/2026/2940", "source": "By Meeting", "user": "Murli dar sukla", "customer": "S.L.N TRDERS", "contact": "D.N RAMAKRISHNA", "mobile": "M: +91-9448674171", "remarks": "HE WANT TO PURCHASE 8 CHUTE SMART AI", "state": "Karnataka", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-20", "uqn": "KC/NIC0D01001/2026/2939", "source": "By Call", "user": "Deepesh", "customer": "M/s-Surya Roshni Ltd.", "contact": "Mr.Gitesh Sharma", "mobile": "M: +91-7509001280", "remarks": "DSD205+TF280+F250KE+5000 Ltr Tank", "state": "Madhya Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "New"},
  {"date": "2026-01-19", "uqn": "CS/NIC0D01001/2026/2938", "source": "By Call", "user": "Deepesh", "customer": "GDP AGRO AND FOOD PRODUCTS PRIVATE LIMITED.", "contact": "Mr. Dharm Aggarwal Ji", "mobile": "M: +91-9340566983", "remarks": "RD \u2013 Quotation was already sent to the customer by Deepesh Sir on 19-01-2026", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-18", "uqn": "MRC/MU/2026/2937", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Ajay Trading co.", "contact": "Mr.Ajay", "mobile": "M: +91-9936504761", "remarks": "QUOTATION SEND", "state": "Haryana", "leadType": "MRC AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-17", "uqn": "CS/MU/2026/2935", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Sunil Industries", "contact": "MR. Sunil Sahu", "mobile": "M: +918305837039", "remarks": "QUOTATION SEND", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-17", "uqn": "CS/MU/2026/2934", "source": "By Meeting", "user": "Murli dar sukla", "customer": "GS & SONS", "contact": "Mr. Rajan sahu", "mobile": "M: +91-9950054677", "remarks": "HE WANT TO PURCHASE 6 CHUTE MEYER COLOR SORTER.", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-01-17", "uqn": "CS/NICUU001/2026/2933", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Mr Arpit Bhandari", "contact": "Mr Arpit Bhandari", "mobile": "M: 9630856364", "remarks": "quotation send and he told me that the price is your machine is very high.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-01-17", "uqn": "KC/NICPLR001/2026/2932", "source": "By Visit", "user": "Rahul Verma", "customer": "PATANJALI FOODS LIMITED", "contact": "Mr. Nikhil Kharwade Ji", "mobile": "M: +91-9823091331", "remarks": "RD-QUOTATION SEND ON-16-01-2026 Kaeser Booster System-N351-G (13 TO 45 Bar) 147 CFM", "state": "Madhya Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-01-17", "uqn": "CS/ERGYT/2026/2931", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "P.R.INDUSTRIES", "contact": "Mr. Rohit Mitruka", "mobile": "M: +91-9414095144", "remarks": "GK-He will connect soon for shortex", "state": "", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-02-28", "uqn": "CS/NICPLR001/2026/3064", "source": "By Visit", "user": "Rahul Verma", "customer": "Palak traders", "contact": "Aman Khandelwal", "mobile": "M: +917000969542", "remarks": "CS 6 chute requirement, 15 kw KC", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-28", "uqn": "CS/NICPL0S001/2026/3063", "source": "Calling", "user": "Shivgatulla", "customer": "Shubh Laxmi udhyog", "contact": "Sourabh Agrawal", "mobile": "M: 8318979635", "remarks": "Interested", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-27", "uqn": "PM/02021/2026/3062", "source": "Calling", "user": "Jaipal", "customer": "Ashish ji", "contact": "Ashish ji", "mobile": "M: 9416342973", "remarks": "Interested", "state": "Haryana", "leadType": "PACKING MACHINE", "stage": "New"},
  {"date": "2026-02-27", "uqn": "CS/NICPLR001/2026/3061", "source": "By Visit", "user": "Rahul Verma", "customer": "Alok dal udhyog", "contact": "Alok jain", "mobile": "M: +919425428616", "remarks": "Interested CS for desi chana, kabuli dunkey machine", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-26", "uqn": "CS/NICPLR001/2026/3060", "source": "By Visit", "user": "Rahul Verma", "customer": "Jay traders", "contact": "Jay mundra", "mobile": "M: 90397 07410", "remarks": "Planing 6 chute CS for wheat", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-26", "uqn": "CS/NICPLR001/2026/3059", "source": "By Visit", "user": "Rahul Verma", "customer": "SR enterprises sonkatch", "contact": "Rohit mahajan", "mobile": "M: +91-9755596191", "remarks": "Interested in cs, 6 chute for wheat.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-27", "uqn": "KC/VK/2026/3058", "source": "By Meeting", "user": "Vinod", "customer": "Goel Industries (Bahraich)", "contact": "Mr Neeraj Kumar Agarwal", "mobile": "M: 9918000012", "remarks": "Sir requirement 30 hp new compressor his new plywood factory is upcoming", "state": "Uttar Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-26", "uqn": "KC/NICP0J0002/2026/3057", "source": "By Meeting", "user": "J Prashant", "customer": "Babaji Snacks Pvt. Ltd. (Unit-2)", "contact": "Mr Manoj Kumar Sood", "mobile": "M: +91-8586044051", "remarks": "Right now all compressor are running continuously", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-26", "uqn": "M001/NICPL0H000/2026/3056", "source": "By Meeting", "user": "Himanshu Nagar", "customer": "MAHAVEER TRADERS", "contact": "MR. Rajkumar Gupta", "mobile": "M: +91-99566 14281", "remarks": "NEED COLOR SORTER", "state": "Uttar Pradesh", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-02-26", "uqn": "KC/NICP0J0002/2026/3055", "source": "By Meeting", "user": "J Prashant", "customer": "Vanesa Cosmetics Private Limited", "contact": "Ravindra Singh", "mobile": "M: +91-9466202732", "remarks": "Customer is planning to buy compressor near to Diwali 2026", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-26", "uqn": "MRC/NICP0J0002/2026/3054", "source": "By Meeting", "user": "J Prashant", "customer": "Goel Food Products (Rai)", "contact": "Mr Ishu Goel", "mobile": "M: +91-9999119890", "remarks": "Customer planing to change the compressor", "state": "Haryana", "leadType": "MRC AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-26", "uqn": "CS/NICP0J0002/2026/3053", "source": "By Meeting", "user": "J Prashant", "customer": "SIVA FOODS IMPEX PRIVATE LIMITED", "contact": "Mr Ponmanikandan", "mobile": "M: +91-9786757514", "remarks": "NEED COLOR SORTER", "state": "Tamil Nadu", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-26", "uqn": "CS/NICPLR001/2026/3052", "source": "EXPO", "user": "Rahul Verma", "customer": "Sworn Agritech pvt ltd", "contact": "Aman Sohaney", "mobile": "M: +91-7987777677", "remarks": "Interested for cs, kc, packaging machine", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-25", "uqn": "CS/MU/2026/3051", "source": "By Meeting", "user": "Murli dar sukla", "customer": "SHIV SHAKTI TRADERS", "contact": "Dear sir,", "mobile": "M: +91-7007791816", "remarks": "HE WANT TO PURCHASE 6 CHUTE MEYER COLOR SORTER AND 30 HP MRC COMPRESSOR.", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-25", "uqn": "GD/MU/2026/3050", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Annapurna Traders", "contact": "BARUN MAHAPATRA", "mobile": "M: +91-7797269835", "remarks": "HE WANT TO PURCHASE 8 CHUTE CG AI DEEP LEARNING TECHNOLOGY.", "state": "West Bengal", "leadType": "Grain Dryer", "stage": "New"},
  {"date": "2026-02-25", "uqn": "CS/MU/2026/3049", "source": "By Meeting", "user": "Murli dar sukla", "customer": "KK AGRICOM", "contact": "VIKASH KOTHARI", "mobile": "M: +91-9422540640", "remarks": "HE WANT TO PURCHASE 6 CHUTE MEYER COLOR SORTER AND 30 HP MRC COMPRESSOR.", "state": "Maharashtra", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-25", "uqn": "CS/RB/2026/3048", "source": "By Call", "user": "RAHUL", "customer": "Parvesh Joshi and company", "contact": "Mr. Shyam Gupta Ji", "mobile": "M: +91-9350041010", "remarks": "NEED COLOR SORTER", "state": "Gujarat", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-25", "uqn": "KC/NICP0A00RK/2026/3047", "source": "By Call", "user": "Rohit Kumar", "customer": "NIDHISH CONSIGNER PRIVATE LIMITED", "contact": "MR. SALMAN RASHEED", "mobile": "M: +91-8299274855", "remarks": "1 AIR COMPRESSOR 575 CFM WITH AIR DRYER 2 SET 2 AIR COMPRESSOR - 450 CFM WITH AIR DRYER 2 SET 3 AIR ", "state": "Uttar Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-25", "uqn": "KC/NICPLA0006/2026/3046", "source": "By Meeting", "user": "Alok", "customer": "Manohar filaments Pvt Ltd (Kundli)", "contact": "Mr. Sandeep Yadav", "mobile": "M: +91-9649262696", "remarks": "NEED AIR COMPRESSOR & AIR DRYER", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-24", "uqn": "GD/NICPLR001/2026/3045", "source": "By Visit", "user": "Rahul Verma", "customer": "Patanjali foods limited.", "contact": "Krati sharma", "mobile": "M: +917974359492", "remarks": "50 ton capacity grain dryer required", "state": "Madhya Pradesh", "leadType": "Grain Dryer", "stage": "Quotation Send"},
  {"date": "2026-02-24", "uqn": "KC/02021/2026/3044", "source": "Calling", "user": "Jaipal", "customer": "HOME LINEN INTERNATIONAL PRIVATE LIMITED", "contact": "MR. SANDIP GARG", "mobile": "M: +91-9813031560", "remarks": "Customer called for kaeser Compressor 75 and 55 hp", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-23", "uqn": "CS/NICUU001/2026/3043", "source": "By Meeting", "user": "Ujjwal Upadhyay", "customer": "Sinhal agro products", "contact": "Mr gopal sinhal", "mobile": "M: +91-9406659222", "remarks": "I met Gopal ji and he told me that the registration of my plot has not been done yet, first let the ", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-23", "uqn": "KC/NICPLR001/2026/3042", "source": "By Call", "user": "Rahul Verma", "customer": "Green tech Engineering", "contact": "TANNU KOTHARE", "mobile": "M: +91-9243708361", "remarks": "Interested in 37 kw kaeser compressor.", "state": "Madhya Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-21", "uqn": "CS/NICPL0H000/2026/3041", "source": "Calling", "user": "Himanshu Nagar", "customer": "Mr Udit ji", "contact": "Mr Udit ji", "mobile": "M: +91 97949 85072", "remarks": "Plan colour sorter next month", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-21", "uqn": "CS/NICPL0H000/2026/3040", "source": "Calling", "user": "Himanshu Nagar", "customer": "Ram ji", "contact": "Ram ji", "mobile": "M: +91 73799 42949", "remarks": "Plan colour sorter next month", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-21", "uqn": "KC/NICPL0G007/2026/3039", "source": "By Visit", "user": "Gajendra Kumar Jha", "customer": "Loom Solar Pvt.Ltd.", "contact": "Mr.Aman Gupta", "mobile": "M: +91-7895657847", "remarks": "Visit Plan After Holi dated:06-03-26", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-21", "uqn": "CS/NICPL0H000/2026/3038", "source": "Calling", "user": "Himanshu Nagar", "customer": "M/S SHRI JAGDAMBA RICE MILL P. LTD.", "contact": "Jagdish Kumar", "mobile": "M: 9837673237", "remarks": "Plan colour sorter", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-21", "uqn": "CS/NICPL0H000/2026/3037", "source": "Calling", "user": "Himanshu Nagar", "customer": "Somiter Chaturvedi", "contact": "Somiter Chaturvedi", "mobile": "M: 63928 06205", "remarks": "Plan colour sorter may month", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-18", "uqn": "GD/NICPLR001/2026/3036", "source": "By Visit", "user": "Rahul Verma", "customer": "DHRUVI AGRO INDUSTRIES", "contact": "Mr. Rakhab Chandra", "mobile": "M: 9009009011", "remarks": "Interested for CS with KC", "state": "Madhya Pradesh", "leadType": "Grain Dryer", "stage": "New"},
  {"date": "2026-02-21", "uqn": "GD/NICPLR001/2026/3035", "source": "Google Adwords", "user": "Rahul Verma", "customer": "Vishnu dal Mil", "contact": "Goyal ji", "mobile": "M: +91-9425479444", "remarks": "Interested In CS for wheat, chana, mustered", "state": "Madhya Pradesh", "leadType": "Grain Dryer", "stage": "New"},
  {"date": "2026-02-21", "uqn": "KC/VK/2026/3034", "source": "By Meeting", "user": "Vinod", "customer": "Kanaha Food Products", "contact": "Mr Ravi Dalmia", "mobile": "M: 06391917383", "remarks": "Requirement bsd75 t ( 50 hp ) compressor only and complete mice filter", "state": "Uttar Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Hot Lead"},
  {"date": "2026-02-20", "uqn": "CS/MU/2026/3032", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Raj Food", "contact": "pransh ji", "mobile": "M: +91-9425609768", "remarks": "HE WANT TO PURCHASE 8 CHUTE MRC COMPRESSOR.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-20", "uqn": "CS/MU/2026/3031", "source": "By Meeting", "user": "Murli dar sukla", "customer": "R M ENTERPRISES", "contact": "Mr.Sitaram ji", "mobile": "M: +91-9171150988", "remarks": "HE WANT TO PURCHASE 6 CHUTE AND 8 CHUTE MEYER COLOR SORTER 40 HP MRC COMPRESSOR.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-19", "uqn": "CS/VK/2026/3030", "source": "By Meeting", "user": "Vinod", "customer": "Vijay Food Products Pvt. Ltd.", "contact": "Mohit ji", "mobile": "M: 98389 79444", "remarks": "Requirement new sortex for chati dal", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-19", "uqn": "KC/02021/2026/3029", "source": "By Visit", "user": "Jaipal", "customer": "Shakti vardhak seed", "contact": "krishan sharma ji", "mobile": "M: +91-7082005586", "remarks": "on 25th we have sent revised quotation (8% Discount), customer reviewing and update us", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-19", "uqn": "MCK001/02021/2026/3028", "source": "Calling", "user": "Jaipal", "customer": "Harish ji", "contact": "Harish ji", "mobile": "M: 9996274000", "remarks": "customer intrested in color sorter", "state": "Haryana", "leadType": "MCS with KAESER Compressor", "stage": "New"},
  {"date": "2026-02-19", "uqn": "MCK001/02021/2026/3027", "source": "Calling", "user": "Jaipal", "customer": "dinesh ji", "contact": "dinesh ji", "mobile": "M: 9414094242", "remarks": "customer interested in old kaeser compressor", "state": "Rajasthan", "leadType": "MCS with KAESER Compressor", "stage": "New"},
  {"date": "2026-02-19", "uqn": "MCK001/02021/2026/3026", "source": "Calling", "user": "Jaipal", "customer": "sachin ji", "contact": "sachin ji", "mobile": "M: 9001944441", "remarks": "customer interested in old color sorter", "state": "Haryana", "leadType": "MCS with KAESER Compressor", "stage": "New"},
  {"date": "2026-02-19", "uqn": "PM/02021/2026/3025", "source": "Calling", "user": "Jaipal", "customer": "sourabh bansal", "contact": "sourabh bansal", "mobile": "M: 8816833991", "remarks": "customer interested in packing machine and seed dryer", "state": "Haryana", "leadType": "PACKING MACHINE", "stage": "New"},
  {"date": "2026-02-19", "uqn": "PM/02021/2026/3024", "source": "Calling", "user": "Jaipal", "customer": "kushal ji", "contact": "kushal ji", "mobile": "M: 9996906666", "remarks": "customer interested in packing machine", "state": "Haryana", "leadType": "PACKING MACHINE", "stage": "New"},
  {"date": "2026-02-19", "uqn": "AD001/02021/2026/3023", "source": "Calling", "user": "Jaipal", "customer": "Divyanshu goyal ji", "contact": "Divyanshu goyal ji", "mobile": "M: 9729476309", "remarks": "customer interested in seed dryer", "state": "Haryana", "leadType": "AIR Dryer", "stage": "New"},
  {"date": "2026-02-19", "uqn": "MCK001/02021/2026/3022", "source": "Calling", "user": "Jaipal", "customer": "Kamal garg ji", "contact": "Kamal garg ji", "mobile": "M: 9222227706", "remarks": "customer intrested in color sorter", "state": "Haryana", "leadType": "MCS with KAESER Compressor", "stage": "New"},
  {"date": "2026-02-19", "uqn": "MCK001/02021/2026/3021", "source": "Calling", "user": "Jaipal", "customer": "kalash ji", "contact": "kalash ji", "mobile": "M: 9416044430", "remarks": "customer intersted in color sorter", "state": "Haryana", "leadType": "MCS with KAESER Compressor", "stage": "New"},
  {"date": "2026-02-18", "uqn": "AD/NICPL0S001/2026/3020", "source": "Calling", "user": "Shivgatulla", "customer": "Sandeep Agarwal", "contact": "Sandeep Agarwal", "mobile": "M: 8604936049", "remarks": "Currently civil work going on he is interested", "state": "Uttar Pradesh", "leadType": "AIR DRYER", "stage": "New"},
  {"date": "2026-02-18", "uqn": "CS/MU/2026/3019", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Govind traders", "contact": "Gaurav ji", "mobile": "M: +91-9755622555", "remarks": "HE WANT TO PURCHASE 8 CHUTE MEYER COLOR SORTER 40 HP MRC COMPRESSOR.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-18", "uqn": "CS/MU/2026/3018", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Govind traders", "contact": "Gaurav ji", "mobile": "M: +91-9993470466", "remarks": "he want to purchase 8 chute color sorter and MRC compressor.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-18", "uqn": "KC/PRADEEP/2026/3017", "source": "By Meeting", "user": "Pradeep", "customer": "Arjan Impex Private Limited", "contact": "Mr Shiv Kumar", "mobile": "M: +91-9990718229", "remarks": "Sk 22T with tank 500ltr. F26ke", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-17", "uqn": "CS/NICPLR001/2026/3016", "source": "By Visit", "user": "Rahul Verma", "customer": "Keshav Industries", "contact": "Sumeet Badera", "mobile": "M: +919425094530", "remarks": "Interested for Color sorter with kaeser compressor for poha sorting", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-16", "uqn": "GD/NICP0A0010/2026/3015", "source": "By Visit", "user": "Arvind Kumar", "customer": "Fatima Rice Mill", "contact": "Mr. Nasir", "mobile": "M: +91-9897845708", "remarks": "Meeting done with customer regarding grain dryer for Maize and Paddy. He wants 30T production in a d", "state": "Uttar Pradesh", "leadType": "Grain Dryer", "stage": "New"},
  {"date": "2026-02-16", "uqn": "CS/MU/2026/3014", "source": "By Call", "user": "Murli dar sukla", "customer": "SHREE JEE GLOBAL FMCG LIMITED", "contact": "SHRI JI LAL BHAI", "mobile": "M: +91-9033470111", "remarks": "HE WANT TO PURCHASE 10 CHUTE 3 COLOR SORTER.", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-16", "uqn": "M001/NICP0A0008/2026/3013", "source": "By Meeting", "user": "Ashwin Garg", "customer": "Tanay Industries", "contact": "Mahendra Goyal", "mobile": "M: +91-9302101881", "remarks": "Sortex on tuar dall", "state": "Madhya Pradesh", "leadType": "MCS+MRC", "stage": "New"},
  {"date": "2026-02-15", "uqn": "CS/MU/2026/3012", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Sunil Industries", "contact": "jalim singh", "mobile": "M: +91-9893772128", "remarks": "HE WANT TO PURCHASE 6 CHUTE MEYER COLOR SORTER AND MRC COMPRESSOR.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-14", "uqn": "CS/NICPL0S001/2026/3011", "source": "Calling", "user": "Shivgatulla", "customer": "Baijnath", "contact": "Baijnath", "mobile": "M: 9984134905", "remarks": "10 Chute color sorter enquiry planning after season ending", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-14", "uqn": "MCK001/NICPL0H000/2026/3010", "source": "Calling", "user": "Himanshu Nagar", "customer": "SAIBABA INDUSTRIES", "contact": "Mr. Prithvi Wathwani", "mobile": "M: 93011 12065", "remarks": "RD QUOTATION SEND KAESER AIR Refrigeration Dryers-TE 122", "state": "Madhya Pradesh", "leadType": "MCS with KAESER Compressor", "stage": "Quotation Send"},
  {"date": "2026-02-13", "uqn": "CS/NICUU001/2026/3009", "source": "By Call", "user": "Ujjwal Upadhyay", "customer": "Aman enterprises", "contact": "DILEEP KUMAR SETHIYA", "mobile": "M: +91-9977948818", "remarks": "Quotation send", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-13", "uqn": "CS/NICUU001/2026/3008", "source": "By Meeting", "user": "Ujjwal Upadhyay", "customer": "Sujay Agro Industries", "contact": "Manish Pamecha", "mobile": "M: +91-9301705009", "remarks": "He told me that the sortex is not finalized yet: I will update you after 3-4 days.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-13", "uqn": "CS/NICUU001/2026/3007", "source": "By Call", "user": "Ujjwal Upadhyay", "customer": "Raja Traders", "contact": "Mr Dilshan Mansoori", "mobile": "M: +91-9893078619", "remarks": "Quotation send 2 chute 120M smart", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-13", "uqn": "KC/NICPL0G000/2026/3006", "source": "Calling", "user": "Govind", "customer": "Deepak chouhan", "contact": "Deepak chouhan", "mobile": "M: 7302797714", "remarks": "L.d- He will call me soon.", "state": "Haryana", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Follow up"},
  {"date": "2026-02-13", "uqn": "CS/NICPLR001/2026/3004", "source": "By Visit", "user": "Rahul Verma", "customer": "Aarvi Trading company", "contact": "Manoj Agrawal", "mobile": "M: +91-8357063185", "remarks": "Interested in Color sorter", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-13", "uqn": "CS/NICPLR001/2026/3003", "source": "By Visit", "user": "Rahul Verma", "customer": "Shri Govind Traders", "contact": "Abhishek Agrawal", "mobile": "M: +91-9826080516", "remarks": "Interested for Color sorter", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-11", "uqn": "CS/NICP0A0010/2026/3002", "source": "Calling", "user": "Arvind Kumar", "customer": "Amit Goyal", "contact": "Amit Goyal", "mobile": "M: 9818921260", "remarks": "Interested", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-11", "uqn": "CS/NICP0A00RK/2026/3001", "source": "By Call", "user": "Rohit Kumar", "customer": "Sodexo India Services Pvt Ltd", "contact": "MR. ADITYA NARAYAN", "mobile": "M: +91- 94811 20478", "remarks": "NEED COLOR SORTER (DAL,RAJMA, RICE, PER DAY-10 TON", "state": "Karnataka", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-02-11", "uqn": "CS/MU/2026/3000", "source": "By Meeting", "user": "Murli dar sukla", "customer": "G .D agro Industries", "contact": "Vinod ratan", "mobile": "M: +91-7404144485", "remarks": "HE WANT TO PURCHASE 8 CHUTE SMART AI TECHNOLGY.", "state": "Haryana", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-10", "uqn": "CS/MU/2026/2998", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Patidar oil Mill", "contact": "Arjun patidar", "mobile": "M: +91-9009735011", "remarks": "HE WANT TO PURCHASE 6 CHUTE SMART AI WITH 30 HP MRC.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-09", "uqn": "CS/NICP0A0010/2026/2997", "source": "Calling", "user": "Arvind Kumar", "customer": "Mr. Puneet Gupta", "contact": "Mr. Puneet Gupta", "mobile": "M: 9634091051", "remarks": "Interested", "state": "Uttarakhand", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-09", "uqn": "CS/NICUU001/2026/2996", "source": "By Meeting", "user": "Ujjwal Upadhyay", "customer": "Sinhal foods", "contact": "Mr Ashish sinhal", "mobile": "M: +91-9009006900", "remarks": "I met Ashish ji and he asked me that I want to conduct a trial on belt sorter, so where can I do it,", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-09", "uqn": "CS/NICUU001/2026/2995", "source": "By Call", "user": "Ujjwal Upadhyay", "customer": "SHREE NAKODA COTTON GINING AND PRESSING", "contact": "ANSHU CHORDIYA", "mobile": "M: +91-9414730969", "remarks": "I went there and met Naveen ji. He had some doubts regarding EPCG, he got them cleared and Naveen ji", "state": "Rajasthan", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-09", "uqn": "CS/MU/2026/2994", "source": "By Meeting", "user": "Murli dar sukla", "customer": "SS enterprises", "contact": "KAMAL JAIN", "mobile": "M: +91-9111234572", "remarks": "he will finalize thinker model 8 chute", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Hot Lead"},
  {"date": "2026-02-09", "uqn": "CS/MU/2026/2993", "source": "By Meeting", "user": "Murli dar sukla", "customer": "ANUPAM TRADING COMPANY", "contact": "ANUPAM GUPTA", "mobile": "M: +91-9179571371", "remarks": "HE WANT TO PURCHASE 4 CHUTE THINKER MODEL.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-09", "uqn": "CS/MU/2026/2992", "source": "By Meeting", "user": "Murli dar sukla", "customer": "Zakir kisan agro", "contact": "Zakir", "mobile": "M: 7982148979", "remarks": "he want to purchase 4 chute and 8 chute smart model .", "state": "Telangana", "leadType": "COLOR SORTER", "stage": "Quotation Send"},
  {"date": "2026-02-05", "uqn": "CS/NICUU001/2026/2991", "source": "Calling", "user": "Ujjwal Upadhyay", "customer": "Mr sunny", "contact": "Mr sunny", "mobile": "M: 8109203265", "remarks": "I met sunny ji and told him about meyer color sorter then he told me that i visit indore expo and se", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-05", "uqn": "CS/ERGYT/2026/2990", "source": "Google Adwords", "user": "Sachin Kumar 2", "customer": "PURED FOOD PROCESSING", "contact": "Mr. Anand", "mobile": "M: +91-8978050657", "remarks": "Need Color Sorter For Dehydrated Food, Reference of Azista Industries", "state": "Andhra Pradesh", "leadType": "COLOR SORTER", "stage": "Follow up"},
  {"date": "2026-02-04", "uqn": "CS/NICP0A0010/2026/2989", "source": "Calling", "user": "Arvind Kumar", "customer": "Mr. Deepak Rajdev", "contact": "Mr. Deepak Rajdev", "mobile": "M: 8006407700", "remarks": "Approaching for order", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-04", "uqn": "CS/NICP0A0010/2026/2988", "source": "Calling", "user": "Arvind Kumar", "customer": "Mr. Manoj", "contact": "Mr. Manoj", "mobile": "M: 7895588051", "remarks": "Interested", "state": "Uttar Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-04", "uqn": "CS/NICPL0S001/2026/2987", "source": "Calling", "user": "Shivgatulla", "customer": "Deepankar das", "contact": "Deepankar das", "mobile": "M: 9830835579", "remarks": "Interested", "state": "West Bengal", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-03", "uqn": "M001/DEMORM0002/2026/2986", "source": "By Meeting", "user": "Rahul Mahant", "customer": "Krishidhan seeds Pvt Ltd", "contact": "Ramesh Singh Rawat", "mobile": "M: 9244546702", "remarks": "Connected to director of company PO under review soon payment process", "state": "Maharashtra", "leadType": "MCS+MRC", "stage": "Hot Lead"},
  {"date": "2026-02-03", "uqn": "CS/NICP0A0010/2026/2984", "source": "Calling", "user": "Arvind Kumar", "customer": "Sahara Frozen Foods", "contact": ".", "mobile": "M: +91-9926979157", "remarks": "Discussion done regarding color sorter machine for frozen peas. He will update as per future demand.", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-03", "uqn": "CS/NICP0A0010/2026/2983", "source": "Calling", "user": "Arvind Kumar", "customer": "M/s Ashtavinayak Foods Pvt. Ltd.", "contact": "Mr. Radhe Goyal", "mobile": "M: +91-9754750490", "remarks": "Discussion done regarding color sorter machine for frozen peas. This is new plant and started last s", "state": "Madhya Pradesh", "leadType": "COLOR SORTER", "stage": "New"},
  {"date": "2026-02-03", "uqn": "KC/NICPLR001/2026/2982", "source": "By Visit", "user": "Rahul Verma", "customer": "GAJRA DIFFERENTIAL GEARS LIMITED", "contact": "D K CARPENTER", "mobile": "M: +91-9425938172", "remarks": "RD QUOTATION SEND 3rd FEB 2026", "state": "Madhya Pradesh", "leadType": "Kaeser AIR COMPRESSOR", "stage": "Quotation Send"},
  {"date": "2026-02-02", "uqn": "M001/NICP0A0008/2026/2981", "source": "By Meeting", "user": "Ashwin Garg", "customer": "RUKMINI FOOD GRAINS PROCESSOR AND TRADERS", "contact": "P MADHU SUDHANA SETTY", "mobile": "M: +91-70130 21695", "remarks": "4 chute CG DLT model on chickpeas", "state": "Andhra Pradesh", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-02-02", "uqn": "M001/MU/2026/2980", "source": "By Meeting", "user": "Murli dar sukla", "customer": "GHANSHYAMDAS NARAYANDAS GANDHI", "contact": "MR. NIRANJAN GANDHI", "mobile": "M: +91-9422180150", "remarks": "he will finalize next month", "state": "Maharashtra", "leadType": "MCS+MRC", "stage": "Quotation Send"},
  {"date": "2026-02-02", "uqn": "CS/VK/2026/2979", "source": "By Meeting", "user": "Vinod", "customer": "DIVYA ENGINEERING", "contact": "MR. Sarfaraj ji", "mobile": "M: 7703975962", "remarks": "Requirement 2 nos sortex 10 chutes and 7 chutes", "state": "Delhi", "leadType": "COLOR SORTER", "stage": "Hot Lead"}
];

const SALES = [
  {"date": "2026-01-01", "customer": "HINDUSTHAN AGRI SEEDS PVT LTD", "user": "Murli dar sukla", "leadType": "MCS with KAESER Compressor", "amount": 3500000.0, "state": "West Bengal"},
  {"date": "2026-01-01", "customer": "Bankura agro processing Pvt.ltd", "user": "Murli dar sukla", "leadType": "MCS+MRC", "amount": 3751000.0, "state": "West Bengal"},
  {"date": "2026-01-06", "customer": "Shree Radha Laxmi Industries", "user": "Arvind Kumar", "leadType": "Grain Dryer", "amount": 6232594.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-06", "customer": "Singhai & singhai", "user": "RAHUL SIR", "leadType": "COLOR SORTER", "amount": 5200000.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-07", "customer": "Prashant maheshwari", "user": "Rahul Mahant", "leadType": "MCS+MRC", "amount": 3121000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-10", "customer": "AGRAWAL BANDHU AGRO TECH PVT.LTD.", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 3200000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-12", "customer": "Dhirendra International pvt ltd", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 4500000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-12", "customer": "RAJAT AGRO LLP (Gujarat)", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 4100000.0, "state": "Gujarat"},
  {"date": "2026-01-14", "customer": "Shree Balaji Export", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3750000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-14", "customer": "M.M PULSES", "user": "Murli dar sukla", "leadType": "AIR DRYER", "amount": 4550000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-15", "customer": "Shree Giriraj Enterprises", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 2000000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-15", "customer": "HOTWANI FOOD INGREDIENTS PRIVATE LIMITED", "user": "Ashwin Garg", "leadType": "MCS+MRC", "amount": 2470000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-18", "customer": "RAM MOHAN GUPTA GALLA VYAPARI", "user": "Murli dar sukla", "leadType": "MCS+MRC", "amount": 4450000.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-18", "customer": "SHRI MAHAKAL INDUSTRIES", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 4576271.0, "state": "Uttar Pradesh"},
  {"date": "2026-01-29", "customer": "GOYAL AND CO NEEMACH", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3200000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-30", "customer": "R.B. Agro Milling Pvt. Ltd.", "user": "Mahesh Chandra", "leadType": "COLOR SORTER", "amount": 3450000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-31", "customer": "vijay floor mill", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 3850000.0, "state": "Madhya Pradesh"},
  {"date": "2026-01-31", "customer": "DIPALI ENTERPRISE", "user": "Murli dar sukla", "leadType": "COLOR SORTER", "amount": 2600000.0, "state": "West Bengal"},
  {"date": "2026-02-05", "customer": "SHREE RAM INDUSTRIES", "user": "Ujjwal Upadhyay", "leadType": "COLOR SORTER", "amount": 1250000.0, "state": "Rajasthan"},
  {"date": "2026-02-09", "customer": "RATANLAL RAMNIWAS AND COMPANY", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3275000.0, "state": "Madhya Pradesh"},
  {"date": "2026-02-13", "customer": "M/S. PANKAJKUMAR NIRAJ KUMAR", "user": "Ujjwal Upadhyay", "leadType": "COLOR SORTER", "amount": 2625000.0, "state": "Rajasthan"},
  {"date": "2026-02-13", "customer": "Shri Adinath Cashew Private Limited", "user": "RAHUL SIR", "leadType": "COLOR SORTER", "amount": 3759900.0, "state": "Madhya Pradesh"},
  {"date": "2026-02-13", "customer": "GOYAL AND CO NEEMACH", "user": "Ashwin Garg", "leadType": "COLOR SORTER", "amount": 3150000.0, "state": "Madhya Pradesh"}
];

/* ── THEME ────────────────────────────────────────────────────────────────── */
const C = {
  bg:       "#060d1a",
  surface:  "#0c1628",
  card:     "#0f1e35",
  cardHi:   "#152540",
  border:   "#1e3a5f",
  borderHi: "#2a5080",
  gold:     "#f0b429",
  goldDim:  "#c8941a",
  cyan:     "#00cfff",
  green:    "#00e68a",
  rose:     "#ff5075",
  violet:   "#b57bff",
  orange:   "#ff8c42",
  text:     "#e8f2ff",
  sub:      "#8ab0d0",
  dim:      "#3a5878",
};

const PALETTE = ["#00cfff","#00e68a","#f0b429","#ff5075","#b57bff","#ff8c42","#4dffdb","#ff6b9d"];

const USERS = ["All","Ashwin Garg","Murli dar sukla","Arvind Kumar","Rahul Mahant","RAHUL SIR","Govind","Ujjwal Upadhyay","Mahesh Chandra"];
const LEAD_TYPES = ["All","COLOR SORTER","MCS+MRC","Grain Dryer","Kaeser AIR COMPRESSOR","AIR DRYER","MCS with KAESER Compressor"];
const STATES_LIST = ["All","Madhya Pradesh","Uttar Pradesh","West Bengal","Rajasthan","Gujarat","Haryana","Bihar","Delhi"];

function fmt(n) {
  if (n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n/1e5).toFixed(1)} L`;
  if (n >= 1e3) return `₹${(n/1e3).toFixed(0)}K`;
  return `₹${n}`;
}

/* ── SMALL UI ─────────────────────────────────────────────────────────────── */
const FilterPill = ({ label, active, onClick, color = C.cyan }) => (
  <button onClick={onClick} style={{
    padding:"3px 12px", borderRadius:20, border:`1px solid ${active ? color : C.border}`,
    background: active ? `${color}22` : "transparent", color: active ? color : C.sub,
    fontSize:11, cursor:"pointer", fontFamily:"'IBM Plex Mono',monospace", fontWeight:600,
    whiteSpace:"nowrap", transition:"all .15s",
  }}>{label}</button>
);

const KpiCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background:`linear-gradient(135deg,${C.card},${C.cardHi})`,
    border:`1px solid ${color}44`, borderRadius:14, padding:"16px 18px",
    flex:1, minWidth:130, position:"relative", overflow:"hidden",
    boxShadow:`0 4px 24px ${color}18`,
  }}>
    <div style={{position:"absolute",top:-15,right:-15,fontSize:52,opacity:0.07}}>{icon}</div>
    <div style={{fontSize:10,color:C.sub,textTransform:"uppercase",letterSpacing:"0.12em",fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>{label}</div>
    <div style={{fontSize:28,fontWeight:800,color,fontFamily:"'Syne',sans-serif",lineHeight:1.1}}>{value}</div>
    {sub && <div style={{fontSize:10,color:C.dim,marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{fontSize:11,fontWeight:700,color:C.gold,textTransform:"uppercase",
    letterSpacing:"0.14em",fontFamily:"'IBM Plex Mono',monospace",marginBottom:10,
    display:"flex",alignItems:"center",gap:8}}>
    <span style={{width:3,height:14,background:C.gold,borderRadius:2,display:"inline-block"}}/>
    {children}
  </div>
);

/* ── MAIN ─────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [selUser, setSelUser]   = useState("All");
  const [selType, setSelType]   = useState("All");
  const [selState, setSelState] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");

  const filterRow = (row) =>
    (selUser  === "All" || row.user === selUser) &&
    (selType  === "All" || row.leadType === selType) &&
    (selState === "All" || row.state === selState);

  const fVisitors = useMemo(() => VISITORS.filter(filterRow), [selUser, selType, selState]);
  const fLeads    = useMemo(() => LEADS.filter(filterRow),    [selUser, selType, selState]);
  const fSales    = useMemo(() => SALES.filter(r =>
    (selUser  === "All" || r.user === selUser) &&
    (selType  === "All" || r.leadType === selType) &&
    (selState === "All" || r.state === selState)
  ), [selUser, selType, selState]);

  const totalRevenue  = fSales.reduce((s,r) => s+r.amount, 0);
  const quotSent      = fLeads.filter(r=>r.stage==="Quotation Send").length;
  const hotLeads      = fLeads.filter(r=>r.stage==="Hot Lead").length;

  // Chart data
  const sourceData = useMemo(() => {
    const m = {};
    fLeads.forEach(r => { m[r.source] = (m[r.source]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({name,value})).sort((a,b)=>b.value-a.value);
  }, [fLeads]);

  const stageData = [
    {name:"New",       value: fLeads.filter(r=>r.stage==="New").length,            color:C.cyan},
    {name:"Follow up", value: fLeads.filter(r=>r.stage==="Follow up").length,      color:C.violet},
    {name:"Hot Lead",  value: fLeads.filter(r=>r.stage==="Hot Lead").length,       color:C.orange},
    {name:"Quot. Send",value: fLeads.filter(r=>r.stage==="Quotation Send").length, color:C.gold},
    {name:"Pending",   value: fLeads.filter(r=>r.stage==="Pending").length,        color:C.rose},
  ].filter(d=>d.value>0);

  const userSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { m[r.user] = (m[r.user]||0)+r.amount; });
    return Object.entries(m).map(([name,value]) => ({name: name.split(" ")[0], value}))
      .sort((a,b)=>b.value-a.value).slice(0,6);
  }, [fSales]);

  const leadTypeSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { m[r.leadType] = (m[r.leadType]||0)+r.amount; });
    return Object.entries(m).map(([name,value]) => ({
      name: name.length > 12 ? name.slice(0,12)+"…" : name, value
    })).sort((a,b)=>b.value-a.value);
  }, [fSales]);

  const stateSalesData = useMemo(() => {
    const m = {};
    fSales.forEach(r => { m[r.state] = (m[r.state]||0)+r.amount; });
    return Object.entries(m).map(([name,value]) => ({name,value}))
      .sort((a,b)=>b.value-a.value).slice(0,8);
  }, [fSales]);

  const userVisitorData = useMemo(() => {
    const m = {};
    fVisitors.forEach(r => { m[r.user.split(" ")[0]] = (m[r.user.split(" ")[0]]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({name,value}))
      .sort((a,b)=>b.value-a.value).slice(0,6);
  }, [fVisitors]);

  const ttp = {
    contentStyle:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11,fontFamily:"'IBM Plex Mono',monospace"},
    labelStyle:{color:C.sub},
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'IBM Plex Mono',monospace",
      backgroundImage:"radial-gradient(ellipse at 20% 0%,#0a2040 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,#0a1828 0%,transparent 60%)"}}>

      {/* ── HEADER ── */}
      <header style={{
        background:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:"0 24px", display:"flex", alignItems:"center", gap:16, height:60,
        boxShadow:`0 2px 20px #00000044`,
        position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background:`linear-gradient(135deg,${C.gold},${C.orange})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, fontWeight:900, color:"#000", fontFamily:"'Syne',sans-serif",
          }}>N</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:C.text,lineHeight:1}}>
              North India Compressors
            </div>
            <div style={{fontSize:10,color:C.gold,letterSpacing:"0.1em",marginTop:2}}>
              SALES DASHBOARD · JAN–FEB 2026
            </div>
          </div>
        </div>

        <div style={{flex:1}}/>

        {/* Tabs */}
        {[["overview","Overview"],["leads","Leads"],["sales","Sales"],["visitors","Visitors"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{
            background: activeTab===id ? `${C.gold}22` : "none",
            border:`1px solid ${activeTab===id ? C.gold : C.border}`,
            color: activeTab===id ? C.gold : C.sub,
            borderRadius:8, padding:"5px 16px", cursor:"pointer",
            fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fontWeight:600,
            transition:"all .15s",
          }}>{lbl}</button>
        ))}
      </header>

      {/* ── FILTERS ── */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 24px",
        display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>USER</span>
          {USERS.map(u=><FilterPill key={u} label={u==="All"?"All":u.split(" ")[0]} active={selUser===u} color={C.cyan} onClick={()=>setSelUser(u)}/>)}
        </div>
        <div style={{width:1,height:24,background:C.border}}/>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>TYPE</span>
          {LEAD_TYPES.map(t=><FilterPill key={t} label={t==="All"?"All":t.length>10?t.slice(0,10)+"…":t} active={selType===t} color={C.violet} onClick={()=>setSelType(t)}/>)}
        </div>
        <div style={{width:1,height:24,background:C.border}}/>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",marginRight:4}}>STATE</span>
          {STATES_LIST.map(s=><FilterPill key={s} label={s==="All"?"All":s.length>8?s.slice(0,8)+"…":s} active={selState===s} color={C.green} onClick={()=>setSelState(s)}/>)}
        </div>
        {(selUser!=="All"||selType!=="All"||selState!=="All") && (
          <button onClick={()=>{setSelUser("All");setSelType("All");setSelState("All");}} style={{
            padding:"3px 12px",borderRadius:20,border:`1px solid ${C.rose}`,
            background:`${C.rose}18`,color:C.rose,fontSize:11,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,
          }}>✕ Reset</button>
        )}
      </div>

      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>

        {/* ── KPI CARDS ── */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <KpiCard label="Total Visitors"   value={fVisitors.length}        color={C.cyan}   icon="👥" sub="customer visits recorded"/>
          <KpiCard label="Total Leads"      value={fLeads.length}           color={C.violet} icon="🎯" sub={`${hotLeads} hot leads`}/>
          <KpiCard label="Total Sales"      value={fSales.length}           color={C.green}  icon="✅" sub="orders confirmed"/>
          <KpiCard label="Quotations Sent"  value={quotSent}                color={C.amber||C.gold}  icon="📄" sub="awaiting decision"/>
          <KpiCard label="Total Revenue"    value={fmt(totalRevenue)}       color={C.gold}   icon="💰" sub={`avg ${fmt(totalRevenue/(fSales.length||1))}/sale`}/>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>

            {/* Source chart */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <SectionTitle>Lead Source</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sourceData} margin={{top:4,right:8,left:-20,bottom:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:9}} angle={-35} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {sourceData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Stage pie */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <SectionTitle>Lead Pipeline</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} innerRadius={35}
                    label={({name,value})=>`${name}: ${value}`} labelLine={false} stroke="none">
                    {stageData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip {...ttp}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* State Sales */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <SectionTitle>Sales by State</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stateSalesData} layout="vertical" margin={{top:4,right:50,left:70,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10}} width={68}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:9,formatter:v=>fmt(v).replace("₹","")}}>
                    {stateSalesData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Sales */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <SectionTitle>Revenue by User</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userSalesData} layout="vertical" margin={{top:4,right:50,left:55,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10}} width={52}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:9,formatter:v=>fmt(v).replace("₹","")}}>
                    {userSalesData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lead Type Sales */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <SectionTitle>Revenue by Lead Type</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leadTypeSalesData} layout="vertical" margin={{top:4,right:50,left:80,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tick={{fill:C.sub,fontSize:9}} tickFormatter={v=>fmt(v).replace("₹","")}/>
                  <YAxis type="category" dataKey="name" tick={{fill:C.text,fontSize:10}} width={78}/>
                  <Tooltip {...ttp} formatter={v=>[fmt(v),"Revenue"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]} label={{position:"right",fill:C.sub,fontSize:9,formatter:v=>fmt(v).replace("₹","")}}>
                    {leadTypeSalesData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Visitors by User */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <SectionTitle>Visitors by User</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userVisitorData} margin={{top:4,right:8,left:-20,bottom:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="name" tick={{fill:C.sub,fontSize:10}} angle={-30} textAnchor="end" interval={0}/>
                  <YAxis tick={{fill:C.sub,fontSize:9}}/>
                  <Tooltip {...ttp}/>
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {userVisitorData.map((_,i)=><Cell key={i} fill={PALETTE[i%PALETTE.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── VISITORS TAB ── */}
        {activeTab === "visitors" && (
          <DataTab rows={fVisitors} cols={["date","leadType","user","customer","contact","state","city","existing","remarks"]} title="Visitor Records" color={C.cyan}/>
        )}

        {/* ── LEADS TAB ── */}
        {activeTab === "leads" && (
          <DataTab rows={fLeads} cols={["date","source","user","customer","contact","state","leadType","stage","remarks"]} title="Lead Records" color={C.violet}/>
        )}

        {/* ── SALES TAB ── */}
        {activeTab === "sales" && (
          <DataTab rows={fSales} cols={["date","customer","user","leadType","amount","state"]} title="Sales Records" color={C.green}
            formatCell={(col,val) => col==="amount" ? fmt(val) : String(val??"")}/>
        )}

      </div>
    </div>
  );
}

/* ── DATA TABLE COMPONENT ─────────────────────────────────────────────────── */
function DataTab({ rows, cols, title, color, formatCell }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PER = 20;

  const filtered = useMemo(() => {
    if (!search) return rows;
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase())));
  }, [rows, search]);

  const paged = filtered.slice(page*PER, (page+1)*PER);
  const pages = Math.ceil(filtered.length/PER);

  const fmt2 = formatCell || ((col, val) => String(val??""));

  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <SectionTitle>{title} ({filtered.length})</SectionTitle>
        <div style={{flex:1}}/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="Search..."
          style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
            color:C.text,padding:"6px 12px",fontSize:11,fontFamily:"'IBM Plex Mono',monospace",outline:"none",width:200}}/>
      </div>
      <div style={{overflowX:"auto",borderRadius:10,border:`1px solid ${C.border}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead>
            <tr style={{background:C.surface}}>
              {cols.map(col=>(
                <th key={col} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,
                  borderBottom:`1px solid ${C.border}`,color:color,
                  fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",
                  fontSize:9,letterSpacing:"0.1em",whiteSpace:"nowrap"}}>
                  {col.replace(/([A-Z])/g," $1").trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}44`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.cardHi}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {cols.map(col=>(
                  <td key={col} style={{padding:"8px 12px",color:
                    col==="amount"?C.green:col==="stage"?
                      ({New:C.cyan,"Hot Lead":C.orange,"Quotation Send":C.gold,"Follow up":C.violet,Pending:C.rose}[row[col]]||C.text)
                    :C.text,
                    whiteSpace:"nowrap",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis"}}>
                    {fmt2(col, row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{display:"flex",gap:6,justifyContent:"center",alignItems:"center"}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
            style={{background:"none",border:`1px solid ${C.border}`,color:C.sub,borderRadius:7,
              padding:"4px 12px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>Prev</button>
          <span style={{color:C.sub,fontSize:11}}>{page+1} / {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}
            style={{background:"none",border:`1px solid ${C.border}`,color:C.sub,borderRadius:7,
              padding:"4px 12px",cursor:"pointer",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>Next</button>
        </div>
      )}
    </div>
  );
}