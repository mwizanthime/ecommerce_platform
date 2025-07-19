-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2025 at 07:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elearningproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `adminId` int(11) NOT NULL,
  `adminName` varchar(255) NOT NULL,
  `adminEmail` varchar(255) NOT NULL,
  `adminPassword` varchar(255) NOT NULL,
  `adminBio` varchar(255) NOT NULL,
  `adminGender` varchar(20) NOT NULL,
  `regdate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`adminId`, `adminName`, `adminEmail`, `adminPassword`, `adminBio`, `adminGender`, `regdate`) VALUES
(1, 'anthime', 'anthime@gmail.com', '$2b$10$dvkk6VVe5lVCGBPPQJn/eOuyUmRHaPh3xOmf/.Vl0.1TeYXhQBcEW', 'I can manage people', 'male', '2025-04-05 11:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `answersId` int(11) NOT NULL,
  `quizId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `answerOption` varchar(255) NOT NULL,
  `isCorrect` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`answersId`, `quizId`, `studentId`, `answerOption`, `isCorrect`) VALUES
(14, 7, 3, 'For webdevelopment', 1),
(15, 7, 3, 'For machine learning', NULL),
(16, 7, 3, 'for blockchain application development', NULL),
(17, 7, 3, 'none of the above answers is true', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `courseId` int(11) NOT NULL,
  `instructorId` int(11) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `courseDescription` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`courseId`, `instructorId`, `courseName`, `courseDescription`) VALUES
(1, 4, 'webDevelopment', 'Web development is the process of building and maintaining websites or web applications using technologies like HTML, CSS, JavaScript, and backend frameworks.'),
(2, 4, 'Data Science', 'Data science is an interdisciplinary field that uses statistics, machine learning, and programming to extract insights and knowledge from data.'),
(13, 4, 'Machine learning', 'Machine learning is a field of AI that enables computers to learn from data and make predictions or decisions without being explicitly programmed.'),
(19, 4, 'Mobile application', 'Mobile application development is the process of designing, building, and maintaining software applications for mobile devices using platforms like Android and iOS.');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollmentId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `enrollmentDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollmentId`, `studentId`, `courseId`, `enrollmentDate`) VALUES
(1, 3, 1, '2025-04-15 06:48:44'),
(2, 3, 19, '2025-04-15 11:54:46'),
(3, 4, 1, '2025-04-16 08:26:50'),
(4, 4, 13, '2025-04-16 15:33:30');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` date NOT NULL DEFAULT current_timestamp(),
  `file_type` enum('video','pdf','excel','text','other') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `courseId`, `title`, `description`, `file_path`, `created_at`, `file_type`) VALUES
(1, 1, 'lesson 1', 'lesson one description', 'uploads\\1740993406790.pdf', '2025-03-03', 'pdf'),
(2, 2, 'lesson 2', 'lesson two description', 'uploads\\1742843212511.pdf', '2025-03-24', 'pdf'),
(3, 13, 'how to install flutter', 'flutter installation', 'uploads\\1743080588893.pdf', '2025-03-27', 'pdf'),
(4, 13, 'Introction to machine learning', 'types of models in ml', 'uploads\\1743771932826.mp4', '2025-04-04', 'video'),
(5, 1, 'Technologies in web development', 'here are some technologies used in web development', 'uploads\\1744111076965.doc', '2025-04-08', 'other');

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `instructorId` int(11) NOT NULL,
  `instructorName` varchar(255) NOT NULL,
  `instructorEmail` varchar(255) NOT NULL,
  `instructorPassword` varchar(255) NOT NULL,
  `instructorBio` varchar(255) NOT NULL,
  `instructorGender` varchar(20) NOT NULL,
  `regdate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`instructorId`, `instructorName`, `instructorEmail`, `instructorPassword`, `instructorBio`, `instructorGender`, `regdate`) VALUES
(4, 'sonyanthime', 'sonyanthime@gmail.com', '$2b$10$JVuT5CsVwHZ95WMPo7oe7OiZuqn8ifDhi0TVR34PU47NYVo2zhnle', 'i like teaching', 'male', '2025-04-05 11:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `lessonId` int(11) NOT NULL,
  `lessonTitle` varchar(255) NOT NULL,
  `lessonContent` varchar(255) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `quizId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `lessonId` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `questionType` enum('multiple_choice','open_question') NOT NULL,
  `correctAnswer` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quizId`, `courseId`, `lessonId`, `question`, `questionType`, `correctAnswer`, `created_at`) VALUES
(2, 1, 1, 'what is react?', 'open_question', 'is a framework of js', '2025-04-03 14:38:28'),
(7, 1, 1, 'What is the use of js(JavaScript)?', 'multiple_choice', 'For webdevelopment', '2025-04-10 07:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_submissions`
--

CREATE TABLE `quiz_submissions` (
  `id` int(11) NOT NULL,
  `studentEmail` varchar(255) NOT NULL,
  `courseId` int(11) NOT NULL,
  `quizId` int(11) NOT NULL,
  `lessonId` int(11) NOT NULL,
  `studentAnswer` text NOT NULL,
  `instructorScore` int(11) NOT NULL,
  `status` enum('pending','Marked','Incorrect') NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_submissions`
--

INSERT INTO `quiz_submissions` (`id`, `studentEmail`, `courseId`, `quizId`, `lessonId`, `studentAnswer`, `instructorScore`, `status`, `submitted_at`) VALUES
(1, 'kkk@gmail.com', 1, 2, 1, 'is a framework of js', 5, 'Marked', '2025-04-12 07:28:13'),
(2, 'kkk@gmail.com', 1, 7, 1, 'For webdevelopment', 5, 'Marked', '2025-04-12 07:28:13'),
(3, 'muhirebagina@gmail.com', 1, 2, 1, 'is used for machine learning', 0, 'Incorrect', '2025-04-16 08:25:30'),
(4, 'muhirebagina@gmail.com', 1, 7, 1, 'For webdevelopment', 5, 'Marked', '2025-04-16 08:25:30');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `studentId` int(11) NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `studentEmail` varchar(255) NOT NULL,
  `studentPassword` varchar(255) NOT NULL,
  `studentBio` varchar(255) NOT NULL,
  `studentGender` varchar(11) NOT NULL,
  `regdate` date NOT NULL DEFAULT current_timestamp(),
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`studentId`, `studentName`, `studentEmail`, `studentPassword`, `studentBio`, `studentGender`, `regdate`, `courseId`) VALUES
(1, 'mwizanthime', 'mwizanthime06@gmail.com', '$2b$10$WzVEipjq.5xbrv4vFRTICOdVEg9E29z0z4bpaPlsW2ns/..TTTe7e', 'I like food', 'male', '2025-02-18', 1),
(3, 'scovia', 'kkk@gmail.com', '$2b$10$sBcWpYk2T6YF4IbRqg0goeqVB/NuYdH5kqyBzWDlp0EaNbi2ehxv6', 'bio', 'female', '2025-02-18', 2),
(4, 'muhire', 'muhirebagina@gmail.com', '$2b$10$nwuuObYSju/blIUBx.cvs.QTzjLQE8WgSc.vzSOGgdXzTrgLhsTpe', 'we like food and drinks', 'male', '2025-02-19', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`adminId`);

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answersId`),
  ADD KEY `quizId` (`quizId`),
  ADD KEY `fk_student_id` (`studentId`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`courseId`),
  ADD KEY `instructorId` (`instructorId`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollmentId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`instructorId`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lessonId`),
  ADD KEY `courseId` (`courseId`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quizId`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `lessonId` (`lessonId`);

--
-- Indexes for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `quizId` (`quizId`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`studentId`),
  ADD KEY `courseId` (`courseId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `adminId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answersId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `courseId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `instructorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `lessonId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quizId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `studentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`quizId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_student_id` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructorId`) REFERENCES `instructors` (`instructorId`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`);

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`);

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`lessonId`) REFERENCES `files` (`id`);

--
-- Constraints for table `quiz_submissions`
--
ALTER TABLE `quiz_submissions`
  ADD CONSTRAINT `quiz_submissions_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`),
  ADD CONSTRAINT `quiz_submissions_ibfk_2` FOREIGN KEY (`quizId`) REFERENCES `quizzes` (`quizId`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
