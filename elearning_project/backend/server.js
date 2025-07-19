const express = require("express");
const multer = require("multer");
//(1)update mysql to mysql2(for Promise & Async/Await Support)
const mysql = require("mysql");
const port = 5000;
const app = express();
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const path = require("path");
const { error } = require("console");
const OpenAI = require("openai");
const fs = require("fs");

// (3)to read json correctly
app.use(bodyParser.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, httpOnly: true, secure: false },
  })
);

// connect db
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "elearningProject",
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Register users
app.post("/add-student", async (req, res) => {
  const {
    studentName,
    studentEmail,
    studentPassword,
    studentBio,
    studentGender,
    courseId,
  } = req.body;

  // (4) hash password
  const hashedPassword = await bcrypt.hash(studentPassword, 10);

  db.query(
    "SELECT * FROM students WHERE studentName = ?",
    [studentName],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Query error" });
      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "Student with this name already exists" });
      }

      db.query(
        "INSERT INTO students (studentName, studentEmail, studentPassword, studentBio, studentGender, courseId) VALUES (?, ?, ?, ?, ?, ?)",
        [
          studentName,
          studentEmail,
          hashedPassword,
          studentBio,
          studentGender,
          courseId,
        ],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Error inserting student" });
          return res
            .status(200)
            .json({ message: "Student added successfully" });
        }
      );
    }
  );
});

// Get courses
app.get("/get-courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching courses" });
    }
    return res.json({ courses: results });
  });
});

//edit course

app.put("/edit-course/:courseId", (req, res) => {
  const { courseId } = req.params;
  const { courseName, courseDescription } = req.body;
  if (courseName && courseDescription) {
    db.query(
      "UPDATE courses set courseName=?, courseDescription=? where courseId=?",
      [courseName, courseDescription, courseId],
      (error, result) => {
        if (error) {
          return res.json({ message: "query error to update this course" });
        }
        return res.json({ message: "Course updated successfully" });
      }
    );
  }
});

// Register instructor
app.post("/add-instructor", async (req, res) => {
  const {
    instructorName,
    instructorEmail,
    instructorPassword,
    instructorBio,
    instructorGender,
  } = req.body;

  // (4) hash password
  const hashedPassword = await bcrypt.hash(instructorPassword, 10);

  db.query(
    "SELECT * FROM instructors WHERE instructorName = ?",
    [instructorName],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Query error" });
      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "instructor with this name already exists" });
      }

      db.query(
        "INSERT INTO instructors (instructorName, instructorEmail, instructorPassword, instructorBio, instructorGender) VALUES (?, ?, ?, ?, ?)",
        [
          instructorName,
          instructorEmail,
          hashedPassword,
          instructorBio,
          instructorGender,
        ],
        (err, result) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Error inserting instructor" });
          return res
            .status(200)
            .json({ message: "instructor added successfully" });
        }
      );
    }
  );
});

// Register admin
app.post("/add-admin", async (req, res) => {
  const { adminName, adminEmail, adminPassword, adminBio, adminGender } =
    req.body;

  // (4) hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  db.query(
    "SELECT * FROM admins WHERE adminName = ?",
    [adminName],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Query error" });
      if (result.length > 0) {
        return res
          .status(400)
          .json({ message: "admin with this name already exists" });
      }

      db.query(
        "INSERT INTO admins (adminName, adminEmail, adminPassword, adminBio, adminGender) VALUES (?, ?, ?, ?, ?)",
        [adminName, adminEmail, hashedPassword, adminBio, adminGender],
        (err, result) => {
          if (err)
            return res.status(500).json({ message: "Error inserting admin" });
          return res.status(200).json({ message: "admin added successfully" });
        }
      );
    }
  );
});

//get student by id

app.get("/get-student/:studentId", (req, res) => {
  const { studentId } = req.params;
  db.query(
    "select * from students where studentId=?",
    [studentId],
    (err, results) => {
      if (err) {
        return res.json({ message: "query error to select student by id" });
      }
      return res.json(results[0]);
    }
  );
});

//get all admins

app.get("/admins", (req, res) => {
  db.query("select * from admins", (err, results) => {
    if (err) {
      return res.json({ message: "query error to select admins" });
    }
    return res.json(results);
  });
});

//get all admins by id

app.get("/admins/:adminId", (req, res) => {
  const { adminId } = req.params;
  db.query(
    "select * from admins where adminId=?",
    [adminId],
    (err, results) => {
      if (err) {
        return res.json({ message: "query error to select admins by id" });
      }
      return res.json(results[0]);
    }
  );
});

// Login
app.post("/login", (req, res) => {
  // passed variables are email and password
  const { email, password } = req.body;
  // Check students table
  db.query(
    "SELECT * FROM students WHERE studentEmail = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (result.length > 0) {
        const student = result[0];
        const isMatch = await bcrypt.compare(password, student.studentPassword);
        if (!isMatch)
          return res.status(400).json({ message: "Invalid password" });

        req.session.student = { email: email, role: "student" };
        return res.json({ message: "Student logged in", role: "student" });
      }

      // Check instructors table
      db.query(
        "SELECT * FROM instructors WHERE instructorEmail = ?",
        [email],
        async (err, result) => {
          if (err) return res.status(500).json({ message: "Database error" });

          if (result.length > 0) {
            const instructor = result[0];
            const isMatch = await bcrypt.compare(
              password,
              instructor.instructorPassword
            );
            if (!isMatch)
              return res.status(400).json({ message: "Invalid password" });

            req.session.instructor = { email: email, role: "instructor" };
            return res.json({
              message: "Instructor logged in",
              role: "instructor",
            });
          }

          // Check admins table
          db.query(
            "SELECT * FROM admins WHERE adminEmail = ?",
            [email],
            async (err, result) => {
              if (err)
                return res.status(500).json({ message: "Database error" });

              if (result.length > 0) {
                const admin = result[0];
                const isMatch = await bcrypt.compare(
                  password,
                  admin.adminPassword
                );
                if (!isMatch)
                  return res.status(400).json({ message: "Invalid password" });

                req.session.admin = { email: email, role: "admin" };
                return res.json({ message: "Admin logged in", role: "admin" });
              }

              return res.status(400).json({ message: "Email not found" });
            }
          );
        }
      );
    }
  );
});

app.get("/indexStudent", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else {
    return res.json({ message: "not logged in" });
  }
});

app.get("/indexInstructor", (req, res) => {
  if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else {
    return res.json({ message: "not logged in" });
  }
});

app.get("/indexAdmin", (req, res) => {
  if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
// get the profile page and its contents
// app.get("/profile", (req, res) => {
//   if (
//     !req.session ||
//     (!req.session.student && !req.session.instructor && !req.session.admin)
//   ) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   let query = "";
//   let params = [];
//   let role = "";
//   if (req.session.student) {
//     query =
//       "SELECT students.courseId AS courseId , students.studentPassword AS password, students.studentName AS name, students.studentBio AS bio, students.studentGender AS gender, students.studentEmail AS email,courses.courseName FROM students JOIN courses ON students.courseId = courses.courseId WHERE studentEmail = ?";
//     params = [req.session.student.email];
//     role = "student";
//   } else if (req.session.instructor) {
//     query =
//       "SELECT instructorName AS name, instructorPassword AS password, instructorBio AS bio, instructorGender AS gender , instructorEmail AS email FROM instructors WHERE instructorEmail = ?";
//     params = [req.session.instructor.email];
//     role = "instructor";
//   } else if (req.session.admin) {
//     query =
//       "SELECT adminName AS name, adminPassword AS password, adminBio AS bio, adminGender AS gender , adminEmail AS email FROM admins WHERE adminEmail = ?";
//     params = [req.session.admin.email];
//     role = "admin";
//   }

//   db.query(query, params, (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error" });
//     }
//     if (result.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = { ...result[0], role };
//     return res.json(user);
//   });
// });

app.get("/profile", (req, res) => {
  if (
    !req.session ||
    (!req.session.student && !req.session.instructor && !req.session.admin)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let query = "";
  let params = [];
  let role = "";

  //   if (req.session.student) {
  //     // query = `
  //     //   SELECT students.courseId AS courseId, students.studentPassword AS password,
  //     //          students.studentName AS name, students.studentBio AS bio,
  //     //          students.studentGender AS gender, students.studentEmail AS email,
  //     //          courses.courseName
  //     //   FROM students
  //     //   JOIN courses ON students.courseId = courses.courseId
  //     //   WHERE studentEmail = ?`;
  //     query =`SELECT
  //   students.studentPassword AS password,
  //   students.studentName AS name,
  //   students.studentBio AS bio,
  //   students.studentGender AS gender,
  //   students.studentEmail AS email,
  //   courses.courseId,
  //   courses.courseName
  // FROM students
  // JOIN enrollments ON students.studentId = enrollments.studentId
  // JOIN courses ON enrollments.courseId = courses.courseId
  // WHERE students.studentEmail = ?
  // `;
  //     params = [req.session.student.email];
  //     role = "student";

  //     db.query(query, params, (err, result) => {
  //       if (err) return res.status(500).json({ message: "Database error" });
  //       if (result.length === 0)
  //         return res.status(404).json({ message: "User not found" });
  //       const user = { ...result[0], role };
  //       return res.json(user);
  //     });
  //   }
  if (req.session.student) {
    query = `
    SELECT 
      students.studentId,
      students.studentPassword AS password,
      students.studentName AS name,
      students.studentBio AS bio,
      students.studentGender AS gender,
      students.studentEmail AS email,
      courses.courseId,
      courses.courseName
    FROM students
    JOIN enrollments ON students.studentId = enrollments.studentId
    JOIN courses ON enrollments.courseId = courses.courseId
    WHERE students.studentEmail = ?
  `;
    params = [req.session.student.email];
    role = "student";

    db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0)
        return res
          .status(404)
          .json({ message: "User not found or not enrolled in any courses" });

      // Use data from the first row for student profile
      const studentProfile = {
        studentId: result[0].studentId,
        name: result[0].name,
        email: result[0].email,
        gender: result[0].gender,
        bio: result[0].bio,
        password: result[0].password,
        role,
        courses: result.map((r) => ({
          courseId: r.courseId,
          courseName: r.courseName,
        })),
      };

      return res.json(studentProfile);
    });
  } else if (req.session.instructor) {
    // Step 1: Get instructor profile info
    const instructorEmail = req.session.instructor.email;
    query = `
      SELECT instructorId, instructorName AS name, instructorPassword AS password, 
             instructorBio AS bio, instructorGender AS gender, instructorEmail AS email 
      FROM instructors 
      WHERE instructorEmail = ?`;
    params = [instructorEmail];
    role = "instructor";

    db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      const instructor = { ...result[0], role };

      // Step 2: Get courses taught by the instructor
      const courseQuery = `SELECT courseId, courseName FROM courses WHERE instructorId = ?`;
      db.query(courseQuery, [instructor.instructorId], (err2, courses) => {
        if (err2)
          return res.status(500).json({ message: "Database error on courses" });
        instructor.courses = courses; // attach course list to instructor object
        return res.json(instructor);
      });
    });
  } else if (req.session.admin) {
    query = `
      SELECT adminName AS name, adminPassword AS password, adminBio AS bio, 
             adminGender AS gender, adminEmail AS email 
      FROM admins 
      WHERE adminEmail = ?`;
    params = [req.session.admin.email];
    role = "admin";

    db.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });
      const user = { ...result[0], role };
      return res.json(user);
    });
  }
});

//edit profile
app.put("/update-profile", async (req, res) => {
  const { email, name, bio, gender, password, role } = req.body;

  let updateQuery;
  let values;

  // If password is empty, don't update it
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateQuery = `UPDATE ${role}s SET ${role}Name=?, ${role}Bio=?, ${role}Gender=?, ${role}Password=? WHERE ${role}Email=?`;
    values = [name, bio, gender, hashedPassword, email];
  } else {
    updateQuery = `UPDATE ${role}s SET ${role}Name=?, ${role}Bio=?, ${role}Gender=? WHERE ${role}Email=?`;
    values = [name, bio, gender, email];
  }

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating profile" });
    }
    return res.status(200).json({ message: "Profile updated successfully" });
  });
});

app.get("/updateCourse", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});

app.get("/download", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});

app.get("/createcontent", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/allCoursesPage", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/quiz", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/report", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/updateStudent", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/updateInstructor", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/updateAdmin", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});
app.get("/instructorDashboard", (req, res) => {
  if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else {
    return res.json({ message: "not logged in as instructor" });
  }
});
app.get("/course-page", (req, res) => {
  if (req.session.student) {
    return res.json(req.session.student);
  } else if (req.session.instructor) {
    return res.json(req.session.instructor);
  } else if (req.session.admin) {
    return res.json(req.session.admin);
  } else {
    return res.json({ message: "not logged in" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "logout failed" });
    } else {
      return res.json({ message: "logout successful" });
    }
  });
});

//api to get all instructors
app.get("/instructors", (req, res) => {
  db.query("SELECT * from instructors", (error, result) => {
    if (error) {
      return res.json({ message: "query error to get all instructors" });
    }
    return res.json(result);
  });
});

//delete instructor using id

app.delete("/delete-instructor/:instructorId", (req, res) => {
  const { instructorId } = req.params;
  db.query(
    "delete from instructors where instructorId=?",
    [instructorId],
    (err, results) => {
      if (err) {
        return res.json({ message: "query error to delete instructor" });
      }
      return res.json({ message: "Instructor deleted successfully" });
    }
  );
});

app.delete("/delete-admin/:adminId", (req, res) => {
  const { adminId } = req.params;
  db.query("delete from admins where adminId=?", [adminId], (err, results) => {
    if (err) {
      return res.json({ message: "Query error to delete admin" });
    }
    return res.json({ message: "Admin deleted successfully" });
  });
});

//get students

app.get("/students", (req, res) => {
  db.query(
    "SELECT students.*, courses.courseName FROM students JOIN courses ON students.courseId = courses.courseId",
    (err, results) => {
      if (err) {
        return res.json({ message: "query error to fetch from students" });
      }
      return res.json(results);
    }
  );
});

//edit student by id
app.put("/edit-student/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const {
    studentName,
    studentEmail,
    studentPassword,
    studentBio,
    studentGender,
    courseId,
  } = req.body;

  try {
    // Get the existing password if no new one is provided
    db.query(
      "SELECT studentPassword FROM students WHERE studentId = ?",
      [studentId],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error fetching student data" });
        }

        let hashedPassword = results[0]?.studentPassword; // Keep the old password

        // If a new password is provided, hash it
        if (studentPassword && studentPassword.trim() !== "") {
          hashedPassword = await bcrypt.hash(studentPassword, 10);
        }

        // Update the student details
        db.query(
          "UPDATE students SET studentName=?, studentEmail=?, studentPassword=?, studentBio=?, studentGender=?, courseId=? WHERE studentId=?",
          [
            studentName,
            studentEmail,
            hashedPassword,
            studentBio,
            studentGender,
            courseId,
            studentId,
          ],
          (updateErr, result) => {
            if (updateErr) {
              return res
                .status(500)
                .json({ message: "Error updating student" });
            }
            return res.json({ message: "Student updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

//edit instructor by id
app.put("/edit-instructor/:instructorId", async (req, res) => {
  const { instructorId } = req.params;
  const {
    instructorName,
    instructorEmail,
    instructorPassword,
    instructorBio,
    instructorGender,
  } = req.body;

  try {
    // Get the existing password if no new one is provided
    db.query(
      "SELECT instructorPassword FROM instructors WHERE instructorId = ?",
      [instructorId],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error fetching instructor data" });
        }

        let hashedPassword = results[0]?.instructorPassword; // Keep the old password

        // If a new password is provided, hash it
        if (instructorPassword && instructorPassword.trim() !== "") {
          hashedPassword = await bcrypt.hash(instructorPassword, 10);
        }

        // Update the instructor details
        db.query(
          "UPDATE instructors SET instructorName=?, instructorEmail=?, instructorPassword=?, instructorBio=?, instructorGender=?, WHERE instructorId=?",
          [
            instructorName,
            instructorEmail,
            hashedPassword,
            instructorBio,
            instructorGender,
            instructorId,
          ],
          (updateErr, result) => {
            if (updateErr) {
              return res
                .status(500)
                .json({ message: "Error updating instructor" });
            }
            return res.json({ message: "Instructor updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

//edit admin by id
app.put("/edit-admin/:adminId", async (req, res) => {
  const { adminId } = req.params;
  const { adminName, adminEmail, adminPassword, adminBio, adminGender } =
    req.body;

  try {
    // Get the existing password if no new one is provided
    db.query(
      "SELECT adminPassword FROM admins WHERE adminId = ?",
      [adminId],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Error fetching admin data" });
        }

        let hashedPassword = results[0]?.adminPassword; // Keep the old password

        // If a new password is provided, hash it
        if (adminPassword && adminPassword.trim() !== "") {
          hashedPassword = await bcrypt.hash(adminPassword, 10);
        }

        // Update the admin details
        db.query(
          "UPDATE admins SET adminName=?, adminEmail=?, adminPassword=?, adminBio=?, adminGender=? WHERE adminId=?",
          [
            adminName,
            adminEmail,
            hashedPassword,
            adminBio,
            adminGender,
            adminId,
          ],
          (updateErr, result) => {
            if (updateErr) {
              return res.status(500).json({ message: "Error updating admin" });
            }
            return res.json({ message: "Admin updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

//delete student by id
app.delete("/delete-student/:studentId", (req, res) => {
  const { studentId } = req.params;
  db.query(
    "delete from students where studentId=?",
    [studentId],
    (err, results) => {
      if (err) {
        return res.json({ message: "query error to delete student" });
      }
      return res.json({ message: "student deleted successfully" });
    }
  );
});

// File Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// Helper function to determine file type
function getFileType(mimetype) {
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype === "application/pdf") return "pdf";
  if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimetype === "application/vnd.ms-excel"
  )
    return "excel";
  if (mimetype.startsWith("text/")) return "text";
  return "other";
}

// Unified Upload API
app.post("/upload-file", upload.single("file"), (req, res) => {
  const { courseId, title, description } = req.body;
  const file = req.file;

  if (!courseId || !title || !file) {
    return res
      .status(400)
      .json({ message: "CourseId, title and file are required" });
  }

  const filePath = file.path;
  const fileType = getFileType(file.mimetype);

  const query = `
    INSERT INTO files (courseId, title, description, file_path, file_type)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [courseId, title, description || "", filePath, fileType],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({
        message: "File uploaded successfully",
        fileId: result.insertId,
        fileType,
      });
    }
  );
});

app.get("/videos", (req, res) => {
  db.query(
    `SELECT * FROM files 
     WHERE file_path LIKE '%.mp4' 
        OR file_path LIKE '%.mov' 
        OR file_path LIKE '%.avi' 
        OR file_path LIKE '%.mkv'
        LIMIT 10`,
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No videos found" });
      }

      return res.json({ video: results });
    }
  );
});

// get lessons and and courseName instead of courseId
app.get("/lessons", (req, res) => {
  db.query(
    `SELECT files.*, courses.courseName FROM files JOIN courses ON files.courseId = courses.courseId `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      return res.json(result);
    }
  );
});

//get lesson by courseId
app.get("/get-lessons/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  const sql = "SELECT * FROM files WHERE courseId = ?";

  db.query(sql, [courseId], (err, results) => {
    if (err) {
      console.error("Error fetching lessons:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ lessons: results });
  });
});

// //add courses to the db
app.post("/addCourse", (req, res) => {
  const { courseName, courseDescription } = req.body;

  db.query(
    "SELECT * FROM courses WHERE courseName = ?",
    [courseName],
    (error, result) => {
      if (error) {
        return res.json({
          message: "Query error while selecting course: " + courseName,
        });
      }
      if (result.length > 0) {
        return res.json({
          message: courseName + " is already in the database",
        });
      }

      db.query(
        "INSERT INTO courses(courseName,courseDescription) VALUES(?,?)",
        [courseName, courseDescription],
        (error, result) => {
          if (error) {
            return res.json({
              message: "Query error while inserting new course",
            });
          }
          return res.json({ message: "New course inserted successfully" });
        }
      );
    }
  );
});

//get contents on the page
app.get("/course-page/:courseId", (req, res) => {
  const { courseId } = req.params;
  db.query(
    "SELECT files.*, courses.courseName FROM files JOIN courses ON files.courseId = courses.courseId WHERE files.courseId = ?",
    [courseId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (result.length > 0) {
        return res.json(result);
      }
      return res.json({ message: "No lesson of this course available" });
    }
  );
});

// Route to download a lesson file with a proper title as filename
app.get("/download/:lessonId", (req, res) => {
  const lessonId = req.params.lessonId;

  // Fetch the lesson by ID to get file path and title
  db.query(
    "SELECT file_path, title FROM files WHERE id = ?",
    [lessonId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).send("Lesson not found");
      }

      const { file_path, title } = results[0];
      const fileLocation = path.join(__dirname, file_path);
      const extension = path.extname(file_path);
      const filename = `${title}${extension}`;

      // Check if the file exists before downloading
      if (fs.existsSync(fileLocation)) {
        return res.download(fileLocation, filename); // This sets Content-Disposition header
      } else {
        return res.status(404).send("File not found");
      }
    }
  );
});

//create quiz for the specific course

app.post("/createQuiz", async (req, res) => {
  const { courseId, lessonId, questionType, question, correctAnswer, options } =
    req.body;

  try {
    const quizResult = await db.query(
      "INSERT INTO quizzes (courseId, lessonId, questionType, question, correctAnswer) VALUES (?, ?, ?, ?, ?)",
      [courseId, lessonId, questionType, question, correctAnswer]
    );

    const quizId = quizResult.insertId;

    if (questionType === "multiple_choice") {
      for (const option of options) {
        await db.query(
          "INSERT INTO quiz_options (quizId, answer, isCorrect) VALUES (?, ?, ?)",
          [quizId, option.answer, option.isCorrect ? 1 : 0]
        );
      }
    }

    return res.status(201).json({ message: "Quiz created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create quiz" });
  }
});

app.get("/quizList/:courseId/:lessonId", (req, res) => {
  const { courseId, lessonId } = req.params;
  db.query(
    `SELECT * FROM quizzes WHERE courseId = ? AND lessonId=? ORDER BY RAND() LIMIT 20`,
    [courseId, lessonId],
    async (err, quizResults) => {
      if (err) return res.status(500).json({ message: "Quiz fetch error" });

      // Get options for each quiz
      const quizzesWithOptions = await Promise.all(
        quizResults.map(async (quiz) => {
          return new Promise((resolve, reject) => {
            db.query(
              "SELECT * FROM answers WHERE quizId = ?",
              [quiz.quizId],
              (err, answers) => {
                if (err) reject(err);
                resolve({ ...quiz, options: answers });
              }
            );
          });
        })
      );

      return res.json(quizzesWithOptions);
    }
  );
});

// app.post("/submit-quiz", async (req, res) => {
//   const { studentEmail, courseId, lessonId, answers } = req.body;

//   try {
//     for (const answer of answers) {
//       await db.query(
//         `INSERT INTO quiz_submissions (studentEmail, courseId, lessonId, quizId, studentAnswer, status)
//          VALUES (?, ?, ?, ?,?, 'pending')`,
//         [studentEmail, courseId, lessonId, answer.quizId, answer.studentAnswer]
//       );
//     }
//     return res.json({ message: "Quiz submitted successfully" });
//   } catch (error) {
//     console.error("Quiz submission error:", error);
//     return res.status(500).json({ message: "Submission failed" });
//   }
// });

app.post("/submit-quiz", async (req, res) => {
  const { studentEmail, courseId, lessonId, answers } = req.body;
  // 1. Check if the student has already submitted the quiz for this course + lesson
  db.query(
    `SELECT * FROM quiz_submissions 
       WHERE studentEmail = ? AND courseId = ? AND lessonId = ?`,
    [studentEmail, courseId, lessonId],
    (error, result) => {
      if (error) {
        return res.json({
          message: "query error to select student if he performed a quiz",
        });
      } else if (result.length > 0) {
        return res.status(400).json({
          message: "You have already submitted the quiz for this lesson.",
        });
      }
      // 2. Proceed to submit if no previous attempt
      for (const answer of answers) {
        db.query(
          `INSERT INTO quiz_submissions (studentEmail, courseId, lessonId, quizId, studentAnswer, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
          [
            studentEmail,
            courseId,
            lessonId,
            answer.quizId,
            answer.studentAnswer,
          ],
          (error, result) => {
            if (error) {
              return res.json({
                message: "query error to insert into submissions",
              });
            }
            return res.json({ message: "Quiz submitted successfully" });
          }
        );
      }
    }
  );
});

//get the courses a signed to an instructor
app.get("/instructor-courses", async (req, res) => {
  const instructorSession = req.session.instructor;

  // Check if session exists
  if (!instructorSession || !instructorSession.email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Instructor not logged in" });
  }

  const instructorEmail = instructorSession.email;

  // Step 1: Get instructorId using instructorEmail
  db.query(
    "SELECT instructorId FROM instructors WHERE instructorEmail = ?",
    [instructorEmail],
    (err, result) => {
      if (err) {
        console.error("Error fetching instructor ID:", err);
        return res
          .status(500)
          .json({ message: "Database error while fetching instructor ID" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Instructor not found for the provided email" });
      }

      const instructorId = result[0].instructorId;

      // Step 2: Fetch the courses for this instructorId
      db.query(
        "SELECT * FROM courses WHERE instructorId = ?",
        [instructorId],
        (courseErr, coursesResult) => {
          if (courseErr) {
            console.error("Error fetching courses:", courseErr);
            return res
              .status(500)
              .json({ message: "Database error while fetching courses" });
          }

          return res.status(200).json({ courses: coursesResult });
        }
      );
    }
  );
});

app.get("/lesson-students/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const query = `
    SELECT 
      enrollments.enrollmentId,
      students.studentId,
      students.studentName,
      courses.courseId,
      courses.courseName,
      enrollments.enrollmentDate
    FROM enrollments
    JOIN students ON enrollments.studentId = students.studentId
    JOIN courses ON enrollments.courseId = courses.courseId
    WHERE enrollments.courseId = ?
  `;

  db.query(query, [courseId], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: `Query error while retrieving students for courseId: ${courseId}`,
        error,
      });
    }

    if (results.length === 0) {
      return res.json({
        message: "No students found for this course.",
        students: [],
      });
    }

    return res.json({ students: results });
  });
});

app.get("/submitted-answers/:courseId/:lessonId", async (req, res) => {
  const { courseId, lessonId } = req.params;

  const query = `
    SELECT 
      students.studentName AS studentName, 
      quizzes.question AS question, 
      quiz_submissions.id AS id,
      quiz_submissions.studentAnswer AS studentAnswer, 
      quiz_submissions.instructorScore AS instructorScore, 
      quiz_submissions.status AS status
    FROM quiz_submissions
    JOIN quizzes ON quiz_submissions.quizId = quizzes.quizId 
    JOIN students ON quiz_submissions.studentEmail = students.studentEmail 
    WHERE quizzes.courseId = ? AND quizzes.lessonId = ? ORDER BY 
  CASE 
    WHEN quiz_submissions.status = 'pending' THEN 0 
    ELSE 1 
  END,
  quiz_submissions.id;
  `;

  db.query(query, [courseId, lessonId], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Error fetching submissions",
        error,
      });
    }
    return res.json({ submissions: results });
  });
});
app.get("/get-correct-answer/:quizId", async (req, res) => {
  const { quizId } = req.params;

  db.query(
    "SELECT correctAnswer FROM quizzes WHERE quizId = ?",
    [quizId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          message: "Error fetching correct answer",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Quiz not found",
        });
      }

      return res.json({
        correctAnswer: results[0].correctAnswer,
      });
    }
  );
});

// Updated API endpoint for marking answers
app.post("/mark-answer", async (req, res) => {
  const { answerId, status, score } = req.body;

  db.query(
    "UPDATE quiz_submissions SET status = ?, instructorScore = ? WHERE id = ?",
    [status, score, answerId],
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Error marking answer",
        });
      }
      return res.json({ success: true });
    }
  );
});

// Check if student is already enrolled
app.get("/check-enrollment/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const studentSession = req.session.student;

  // Check if session exists
  if (!studentSession || !studentSession.email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: student not logged in" });
  }

  const studentEmail = studentSession.email;

  db.query(
    `SELECT studentId from students where studentEmail=?`,
    [studentEmail],
    (error, result) => {
      if (error) {
        return res.json({
          message: "query error to get student id using session studentEmail",
        });
      }
      const studentId = result[0].studentId;
      db.query(
        `SELECT * FROM enrollments WHERE studentId = ? AND courseId = ?`,
        [studentId, courseId],
        (error, results) => {
          if (error) {
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ isEnrolled: results.length > 0 });
        }
      );
    }
  );
});

// Enroll student in course
app.post("/enroll/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const studentSession = req.session.student;

  // Check if session exists
  if (!studentSession || !studentSession.email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: student not logged in" });
  }

  const studentEmail = studentSession.email;

  db.query(
    `SELECT studentId from students where studentEmail=?`,
    [studentEmail],
    (error, result) => {
      if (error) {
        return res.json({
          message: "query error to get student id using session studentEmail",
        });
      }
      const studentId = result[0].studentId;

      // If not enrolled, create new enrollment
      db.query(
        `INSERT INTO enrollments 
         (studentId, courseId) 
         VALUES (?, ?)`,
        [studentId, courseId],
        (error, results) => {
          if (error)
            return res.status(500).json({ error: "Enrollment failed" });
          res.json({ success: true, enrollmentId: results.insertId });
        }
      );
    }
  );
});

// Get lesson completion status
app.get("/lesson-status/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const studentSession = req.session.student;

  // Check if session exists
  if (!studentSession || !studentSession.email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: student not logged in" });
  }

  const studentEmail = studentSession.email;

  db.query(
    `SELECT studentId from students where studentEmail=?`,
    [studentEmail],
    async (error, result) => {
      if (error) {
        res.status(500).json({ message: "Error fetching lesson status" });
      }
      const studentId = result[0].studentId;

      db.query(
        `SELECT files.id AS lessonId, files.title AS lessonTitle,
        CASE WHEN quiz_submissions.id IS NOT NULL AND quiz_submissions.status = 'Marked' AND quiz_submissions.instructorScore >= 5 THEN 1 ELSE 0 END AS completed FROM files LEFT JOIN quiz_submissions ON files.id = quiz_submissions.quizId AND quiz_submissions.studentEmail = ? AND quiz_submissions.courseId = ? AND quiz_submissions.status = 'Marked' AND quiz_submissions.instructorScore >= 5 WHERE files.courseId = ? ORDER BY files.id ASC`,
        [studentId, courseId, courseId],
        (error, result) => {
          if (error) {
            return res.json({
              message: "failed to select lesson status for this course",
              error,
            });
          }
          return res.json({ lessons: result });
        }
      );
    }
  );
});
app.get("/unattempted-lessons/:email/:courseId", (req, res) => {
  const { email, courseId } = req.params;

  const query = `
    SELECT files.id, files.title,
      CASE 
        WHEN quizzes.quizId IS NULL THEN 'no_quiz'
        WHEN quiz_submissions.id IS NULL THEN 'not_attempted'
        ELSE 'attempted'
      END as status
    FROM files
    LEFT JOIN quizzes ON files.id = quizzes.lessonId
    LEFT JOIN quiz_submissions 
      ON quizzes.quizId = quiz_submissions.quizId 
      AND quiz_submissions.studentEmail = ?
    WHERE files.courseId = ?
    GROUP BY files.id
  `;

  db.query(query, [email, courseId], (err, result) => {
    if (err) {
      console.error("Error fetching unattempted lessons:", err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.json({ lessons: result });
  });
});

// Updated /lesson-progress endpoint
app.get("/lesson-progress/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const studentEmail = req.session.student?.email;

  if (!studentEmail) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Updated query: join quiz_submissions with students using studentEmail
  db.query(
    `SELECT DISTINCT quiz_submissions.lessonId FROM quiz_submissions
      JOIN students ON quiz_submissions.studentEmail = students.studentEmail
      WHERE students.studentEmail = ? AND quiz_submissions.courseId = ?
        AND quiz_submissions.status = 'Marked' AND quiz_submissions.instructorScore >= 5 `,
    [studentEmail, courseId],
    (error, result) => {
      if (error) {
        return res.json({ message: "failed to get lesson progress" });
      }
      // Check if the result is an array before trying to map
      if (Array.isArray(result)) {
        const completedLessonIds = result.map((r) => r.lessonId);
        res.json({ completedLessonIds });
      } else {
        res.json({ completedLessonIds: [] });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
