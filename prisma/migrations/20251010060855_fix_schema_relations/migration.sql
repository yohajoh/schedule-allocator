/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "InstitutionUnit" (
    "unit_id" SERIAL NOT NULL,
    "unit_code" VARCHAR(10) NOT NULL,
    "unit_name" VARCHAR(100) NOT NULL,
    "unit_type" VARCHAR(20) NOT NULL,
    "parent_unit_id" INTEGER,

    CONSTRAINT "InstitutionUnit_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "SystemUser" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" CHAR(64) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "SystemUser_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserRoleAssignment" (
    "assignment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "CourseCatalog" (
    "course_id" SERIAL NOT NULL,
    "course_code" VARCHAR(10) NOT NULL,
    "course_title" VARCHAR(255) NOT NULL,
    "credit_hours" DECIMAL(3,2) NOT NULL,
    "has_lecture_component" BOOLEAN NOT NULL,
    "has_lab_component" BOOLEAN NOT NULL,
    "has_tutorial_component" BOOLEAN NOT NULL,
    "offering_dept_id" INTEGER NOT NULL,

    CONSTRAINT "CourseCatalog_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "CoursePrerequisite" (
    "prereq_id" SERIAL NOT NULL,
    "target_course_id" INTEGER NOT NULL,
    "required_course_id" INTEGER NOT NULL,

    CONSTRAINT "CoursePrerequisite_pkey" PRIMARY KEY ("prereq_id")
);

-- CreateTable
CREATE TABLE "StudentBatch" (
    "batch_id" SERIAL NOT NULL,
    "program_dept_id" INTEGER NOT NULL,
    "admissions_year" INTEGER NOT NULL,
    "batch_identifier" VARCHAR(50) NOT NULL,

    CONSTRAINT "StudentBatch_pkey" PRIMARY KEY ("batch_id")
);

-- CreateTable
CREATE TABLE "CurriculumMandatoryMap" (
    "map_id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "year_of_study" INTEGER NOT NULL,
    "semester_in_year" INTEGER NOT NULL,
    "requirement_type" VARCHAR(20) NOT NULL,

    CONSTRAINT "CurriculumMandatoryMap_pkey" PRIMARY KEY ("map_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionUnit_unit_code_key" ON "InstitutionUnit"("unit_code");

-- CreateIndex
CREATE UNIQUE INDEX "SystemUser_username_key" ON "SystemUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SystemUser_email_key" ON "SystemUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAssignment_user_id_unit_id_key" ON "UserRoleAssignment"("user_id", "unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCatalog_course_code_key" ON "CourseCatalog"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "CoursePrerequisite_target_course_id_required_course_id_key" ON "CoursePrerequisite"("target_course_id", "required_course_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBatch_batch_identifier_key" ON "StudentBatch"("batch_identifier");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumMandatoryMap_batch_id_course_id_year_of_study_sem_key" ON "CurriculumMandatoryMap"("batch_id", "course_id", "year_of_study", "semester_in_year");

-- AddForeignKey
ALTER TABLE "InstitutionUnit" ADD CONSTRAINT "InstitutionUnit_parent_unit_id_fkey" FOREIGN KEY ("parent_unit_id") REFERENCES "InstitutionUnit"("unit_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "SystemUser"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "InstitutionUnit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCatalog" ADD CONSTRAINT "CourseCatalog_offering_dept_id_fkey" FOREIGN KEY ("offering_dept_id") REFERENCES "InstitutionUnit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrerequisite" ADD CONSTRAINT "CoursePrerequisite_target_course_id_fkey" FOREIGN KEY ("target_course_id") REFERENCES "CourseCatalog"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrerequisite" ADD CONSTRAINT "CoursePrerequisite_required_course_id_fkey" FOREIGN KEY ("required_course_id") REFERENCES "CourseCatalog"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_program_dept_id_fkey" FOREIGN KEY ("program_dept_id") REFERENCES "InstitutionUnit"("unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumMandatoryMap" ADD CONSTRAINT "CurriculumMandatoryMap_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "StudentBatch"("batch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumMandatoryMap" ADD CONSTRAINT "CurriculumMandatoryMap_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "CourseCatalog"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;
