import bcrypt from "bcryptjs";
import { connectDB } from "../lib/mongodb";
import Student from "../models/Student";
import { initialPasswordForAdmission } from "../lib/studentCredentials";

const STUDENTS_RAW = `1 2024BTCED003 Simran 2 2024BTCED004 Rishika Sharma 3 2024BTCS002 Donald Rungano Murenje 4 2024BTCS003 Ngwainbi Carl Yigha 5 2024BTCS007 Ankit Kumar 6 2024BTCS008 Om Pathak 7 2024BTCS009 Vargdhist Yadav 8 2024BTCS011 Aayush Singh 9 2024BTCS012 Divyansh Sharma 10 2024BTCS013 Nikhil Sharma 11 2024BTCS014 Armaan Sandhu 12 2024BTCS015 Shubam Kumar 13 2024BTCS018 Bhavna Kumari 14 2024BTCS020 Puneet Rana 15 2024BTCS021 Dibya Ranjan Naik 16 2024BTCS024 Gurdeep Singh 17 2024BTCS025 Pranav Shivgotra 18 2024BTCS026 Ravi Kant 19 2024BTCS030 Ayush Singh Butola 20 2024BTCS031 Rajababu Prasad Jaiswal 21 2024BTCS032 Azipoh Ntumfor Petisung 22 2024BTCS033 Aditya Kumar Mukta 23 2024BTCS034 Divyanshi Guleria 24 2024BTCS036 Sudhanshu Kumar 25 2024BTCS038 Vivek Kumar 26 2024BTCS039 Ritesh Kumar 27 2024BTCS040 Avin Joshi 28 2024BTCS041 Harman Singh 29 2024BTCS044 Mawonga Wesley Chris 30 2024BTCS045 Kanhaiya 31 2024BTCS046 Aditya Soni 32 2024BTCS047 Irfan Ahmad Malik 33 2024BTCS049 Mohammad Tanzim Alam 34 2024BTCS050 Sonu Kumar Mandal 35 2024BTCS051 Jitendra Kumar Saw 36 2024BTCS052 Sanjay Saw 37 2024BTCS053 Ankur Verma 38 2024BTCS054 Yuvraj Kumar 39 2024BTCS055 Sandeep Kumar 40 2024BTCS057 Rishabh 41 2024BTCS058 Fatma Zahra 42 2024BTCS060 Bhumi Gupta 43 2024BTCS062 Gaurav Kumar 44 2024BTCS064 Vikash Yadav 45 2024BTCS065 Nitesh Kumar 46 2024BTCS066 Nikhil Kumar 47 2024BTCS067 Sujeet Kumar 48 2024BTCS069 Hardik 49 2024BTCS071 Neha Kumari 50 2024BTCS073 Ashish Kumar Sharma 51 2024BTCS074 Sourabh Kumar 52 2024BTCS075 Sudip Kumar Mishra 53 2024BTCS076 Akash Raj Dubey 54 2024BTCS081 Hardeep Singh 55 2024BTCS082 Sumit 56 2024BTCS083 Akash Kumar 57 2024BTCS084 Abhineet Patel 58 2024BTCS089 Balram Raj 59 2024BTCS090 Sohan Kumar 60 2024BTCS091 Aditya Guleria 61 2024BTCS092 Aditay 62 2024BTCS093 Gulshan Kumar 63 2024BTCS095 Shreya Gautam 64 2024BTCS096 Saumya Kumar 65 2024BTCS097 Robin Choudhary 66 2024BTCS099 Nitin Kumar 67 2024BTCS100 Satyam Kumar 68 2024BTCS101 Arpan Kumar 69 2024BTCS102 Saksham Thakur 70 2024BTCS103 Ayush Raj 71 2024BTCS104 Pawan Kumar 72 2024BTCS105 Anurag Ranjan 73 2024BTCS106 Rihan 74 2024BTCS107 Arshit Rana 75 2024BTCS108 Aniket Rana 76 2024BTCS109 Vishali 77 2024BTCS110 Kunal Sharma 78 2024BTCS111 Maksudan Sharma 79 2024BTCS112 Vivek Raj 80 2024BTCS114 Arjun Kiyam 81 2024BTCS115 Nishant Kumar 82 2024BTCS116 Prachi 83 2024BTCS118 Kaberi Mondal 84 2024BTCS119 Shubham Kumar 85 2024BTCS124 Debashis Moitra 86 2024BTCS125 Dipan Mukherjee 87 2024BTCS126 Vicky Kumar 88 2024BTCS129 Harshpreet Singh 89 2024BTCS130 Gurkirpal Singh 90 2024BTCS131 Ayush Baluni 91 2024BTCS134 Krishna Kumar 92 2024BTCS136 Ayush Vaidya 93 2024BTCS137 Abhay Bakshi 94 2024BTCS139 Navkiran Kaur 95 2024BTCS140 Vanshika 96 2024BTCS142 Prabhkeerat 97 2024BTCS143 Sameer Kumar 98 2024BTCS144 Nishant Kumar 99 2024BTCS145 Mayank Raj 100 2024BTCS146 Anand Kumar 101 2024BTCS147 Aman Tiwari 102 2024BTCS148 Mukesh Kumar 103 2024BTCS149 Nitish Tiwary 104 2024BTCS150 Abhay Narayan Ranjan 105 2024BTCS152 Anshul Sharma 106 2024BTCS153 Aditi Thakur 107 2024BTCS154 Chaitanya Sharma 108 2024BTCS159 Ayush Raj 109 2024BTCS161 Nitesh Kumar Vishwakrma 110 2024BTCS162 Sunny Kumar 111 2024BTCS164 Md Mamoon Mallick 112 2024BTCS165 Vishal Kumar Dubey 113 2024BTCS166 Sunil Kumar Mandal 114 2024BTCS167 Ashish Kumar 115 2024BTCS169 Sumit Kumar Rana 116 2024BTCS171 Ishika 117 2024BTCS172 Paryansh Rana 118 2024BTCS174 Ashish Kumar 119 2024BTCS176 Rana Vishal 120 2024BTCS177 Abhishek Kumar 121 2024BTCS180 Om Kumar 122 2024BTCS182 Anuj Kumar 123 2024BTCS184 Rishab Chauhan 124 2024BTCS186 Sushant Kumar 125 2024BTCS187 Shibu Kumar Verma 126 2024BTCS188 Irshad Ansari 127 2024BTCS189 Sushant Baibhab 128 2024BTCS190 Shubham Kumar 129 2024BTCS192 Anupam Gautam 130 2024BTCS197 Pr प्रदीप Pandit 131 2024BTCS198 Vivek Yadav 132 2024BTCS199 Aditya Devna 133 2024BTCS200 Sudhir Saw 134 2024BTCS202 Sachin Kumar Mandal 135 2024BTCS207 Aditya Kumar 136 2024BTCS208 Saksham 137 2024BTCS209 Sarvjeet Singh 138 2024BTCS210 Aryan 139 2024BTCS211 Arun Kumar 140 2024BTCS212 Prince Kumar 141 2024BTCS213 Arman Singh 142 2024BTCS214 Piyush Upadhyay 143 2024BTCS215 Ayush Singh 144 2024BTCS216 Raj Kumar Rahi 145 2024BTCS219 Chandan Kumar Nayak 146 2024BTCS223 Nitesh Kumar 147 2024BTCS224 Sakshi Kumari 148 2024BTCS225 Mahendra Kumar Nayak 149 2024BTCS227 Aditya Verma 150 2024BTCS228 Pankaj Choudhary 151 2024BTCS232 Sumanpreet Kaur 152 2024BTCS233 Subhash Kumar 153 2024BTCS235 Aayush Kumar 154 2024BTCS237 Pratyush Kumar 155 2024BTCS239 Suraj Kumar 156 2024BTCS240 Muskan Kumari 157 2024BTCS241 Tushar Kumar Keshri 158 2024BTCS242 Muskan 159 2024BTCS244 Vansh Sharma 160 2024BTCS245 Lavish Kamboj 161 2024BTCS246 Vivek Kumar 162 2024BTCS247 Sahil Kumar 163 2024BTCS248 Firdous Ansari 164 2024BTCS249 Niharika Sharma 165 2024BTCS251 Chaman Kumar Saw 166 2024BTCS253 Harsh Vardhan 167 2024BTCS254 Ashish Kumar 168 2024BTCS255 Shlok Kumar 169 2024BTCS256 Russel Ngoni Nyadimbo 170 2024BTCS258 Aanya 171 2024BTCS259 Anshu Kumar 172 2024BTCS262 Gulam Jafar 173 2024BTCS263 Rishabh Kumar Singh 174 2024BTCS265 Rohan Raj 175 2024BTCS266 Suraj Kumar 176 2024BTCS270 Chhaya Kumari 177 2024BTCS271 Amanpreet Singh 178 2024BTCS272 Pride Marasha 179 2024BTCS274 Yash Jaiswal 180 2024BTCS276 Pappu Yadav 181 2024BTCS278 Raghav 182 2024BTCS279 Kajal Kumari 183 2024BTCS282 Prashant Kumar Jha 184 2024BTCS283 Harshit Kumar 185 2024BTCS285 Raushan Kumar 186 2024BTCS287 Vivek Kumar 187 2024BTCS288 Shreyansh Mishra 188 2024BTCS290 Simran Kumari 189 2024BTCS291 Aditi Giri 190 2024BTCS294 Rishav Kumar 191 2024BTCS296 Tubuo Annabel Anbongha 192 2024BTCS299 Anant Singh 193 2024BTCS300 Dhananjay 194 2024BTCS301 Vivek Kumar Pandey 195 2024BTCS302 Md Meraj Quraishi 196 2024BTCS303 Minakshi Anand Singh 197 2024BTCS304 Rohan 198 2024BTCS305 Mayank Garg 199 2024BTCS306 Abhishek Pandey 200 2024BTCS307 Toheed Rayaz 201 2024BTCS309 Malik Saqib Farooq 202 2024BTCS310 Umaid Maqsood 203 2024BTCS311 Owais Ahad Bhat 204 2024BTCS312 Muhammad Nayeem Wagay 205 2024BTCS314 Syed Fayiq Bin Hilal 206 2024BTCS315 Akshay Kumar 207 2024BTCS316 Aman Kumar 208 2024BTCS317 Sagar Kumar Ranjan 209 2024BTCS318 Piyush Kumar Singh 210 2024BTCS319 Aarav Bhatedia 211 2024BTCS321 Ankit Paul 212 2024BTCS323 Satyam Kumar 213 2024BTCS324 Akash Ray 214 2024BTCS327 Apurav Chandel 215 2024BTCS328 Rakesh Kumar 216 2024BTCS329 Navneet Kumar Jha 217 2024BTCS331 Yogesh Kumar 218 2024BTCS332 Mahesh Kumar 219 2024BTCS333 Anupriya Kumari 220 2024BTCS334 Kumari Ayushi 221 2024BTCS336 Surya Pratap Bharti 222 2024BTCS337 Naushad Alam 223 2024BTCS338 Ayush Thakur 224 2024BTCS339 Viyom Dogra 225 2024BTCS340 Paras Kumar 226 2024BTCS341 Kavita Sharma 227 2024BTCS342 Anjali Thakur 228 2024BTCS345 Kanishak Mukta 229 2024BTCS346 Ritima Dhiman 230 2024BTCS347 Kundan Kumar 231 2024BTEE007 Ekom Austin Bara Kum`;

type SeedStudent = {
  admissionNo: string;
  name: string;
};

const parseStudents = (raw: string): SeedStudent[] => {
  const pattern =
    /(\d+)\s+(2024[A-Z]{4,6}\d{3})\s+([\s\S]*?)(?=\s+\d+\s+2024[A-Z]{4,6}\d{3}\s+|$)/g;

  const results: SeedStudent[] = [];
  for (const match of raw.matchAll(pattern)) {
    const admissionNo = match[2].trim();
    const name = match[3].trim().replace(/\s+/g, " ");
    if (!admissionNo || !name) continue;
    results.push({ admissionNo, name });
  }
  return results;
};

const main = async () => {
  const students = parseStudents(STUDENTS_RAW);
  if (students.length === 0) {
    throw new Error("Failed to parse students list");
  }

  await connectDB();

  const admissionNos = students.map((s) => s.admissionNo);
  const existing = await Student.find({ admissionNo: { $in: admissionNos } })
    .select("+password admissionNo mustChangePassword")
    .lean<Array<{ admissionNo: string; password?: string; mustChangePassword?: boolean }>>();

  const existingByAdmission = new Map(existing.map((s) => [s.admissionNo, s]));

  const ops = [];
  let initialized = 0;

  for (const s of students) {
    const prev = existingByAdmission.get(s.admissionNo);
    const hasPassword = Boolean(prev?.password && String(prev.password).length > 0);

    const plainPassword = hasPassword ? null : initialPasswordForAdmission(s.admissionNo);
    const hashed = plainPassword ? await bcrypt.hash(plainPassword, 10) : null;

    if (plainPassword) {
      initialized += 1;
      console.log(`${s.admissionNo} | ${s.name} | ${plainPassword}`);
    }

    ops.push({
      updateOne: {
        filter: { admissionNo: s.admissionNo },
        update: {
          $set: {
            name: s.name,
            admissionNo: s.admissionNo,
            semester: 4,
            role: "student",
            ...(hashed ? { password: hashed, mustChangePassword: true } : {}),
            ...(hasPassword && typeof prev?.mustChangePassword === "boolean"
              ? { mustChangePassword: prev.mustChangePassword }
              : {}),
          },
        },
        upsert: true,
      },
    });
  }

  await Student.bulkWrite(ops, { ordered: false });

  // Deduplicate any legacy records that may have been inserted without a unique index.
  const duplicates = await Student.aggregate<{ _id: string; ids: unknown[]; count: number }>([
    { $group: { _id: "$admissionNo", ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  for (const dup of duplicates) {
    const docs = await Student.find({ admissionNo: dup._id })
      .select("+password updatedAt createdAt")
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean<Array<{ _id: unknown; password?: string }>>();

    const keep =
      docs.find((d) => typeof d.password === "string" && d.password.length > 0) ?? docs[0];

    const removeIds = docs
      .filter((d) => String(d._id) !== String(keep?._id))
      .map((d) => d._id);

    if (removeIds.length > 0) {
      await Student.deleteMany({ _id: { $in: removeIds } });
      console.log(`Deduped ${dup._id}: removed ${removeIds.length} record(s).`);
    }
  }

  console.log(`Seeded/updated ${students.length} students. Initialized passwords: ${initialized}.`);
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
