/**
 * ==================== API 模块统一导出 ====================
 *
 * 本文件仅导出公共 API，内部实现细节不对外暴露
 *
 * 导出内容：
 * - API 调用函数：postAuthLogin, getAuthUserInfo 等
 * - 自定义工具函数：uploadWithProgress, downloadFile 等
 * - 公共类型定义：LoginRequest, LoginResponse, UserInfo
 *
 * 使用指南：
 * - API 函数：import { postAuthLogin } from '@/api'
 * - 类型定义：import type { LoginRequest } from '@/api'
 */

/**
 * ==================== 导出策略 ====================
 *
 * 1. 优先导出 model 中的类型定义 (接口、枚举等)
 * 2. 导出各模块的 API 函数 (只导出函数,不导出 *Result 类型别名)
 * 3. 导出自定义扩展和工具函数
 *
 * 为什么这样做：
 * - model 中的接口 (如 UploadCertificateResult) 是后端返回的数据结构
 * - API 模块中的类型别名 (如 UploadCertificateResult) 是整个响应的类型
 * - 两者同名但不同,会导致 TypeScript 报错,因此只导出函数
 */

// 1. 从 model 目录导出所有类型定义 (优先导出)
export * from './generated/model';

// 2. 自动生成的 API 函数 (只导出函数,不导出类型)
export { teacherLogin, studentLogin } from './generated/auth/auth';

export {
  getAwardRecordById,
  updateAwardRecord,
  deleteAwardRecord,
  queryAwardRecords,
  createAwardRecord,
  uploadCertificate,
  importAwards,
  parseExcel,
  confirmImport,
  exportAwardRecords,
  uploadCertificates,
  matchCertificates,
  downloadCertificates,
  confirmCertificateUpload,
  batchDeleteAwardRecords,
  getAwardRecordStatistics,
  downloadImportTemplate,
} from './generated/award-records/award-records';

export {
  getAwardById,
  updateAward,
  deleteAward,
  createAward,
  listAwardsByCompetition,
} from './generated/awards/awards';

export {
  uploadAttachment1,
  downloadAttachment1,
  listCompetitionAttachmentsByCompetition,
} from './generated/competition-attachments/competition-attachments';

export {
  getNewsById,
  updateNews,
  deleteNews,
  createNews,
  pageNews,
  listCompetitionNewsByCompetition,
} from './generated/competition-news/competition-news';

export {
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  publishCompetition,
  queryCompetitions,
  createCompetition,
  getPublishedCompetitions,
  batchDeleteCompetitions,
} from './generated/competitions/competitions';

export { uploadFile } from './generated/files/files';

export {
  uploadAttachment,
  downloadAttachment,
  listRegistrationAttachmentsByRegistration,
} from './generated/registration-attachments/registration-attachments';

export {
  reviewRegistration,
  batchReviewRegistrations,
  exportRegistrations,
  downloadAttachments,
  queryRegistrations,
  getAuditLogs,
  getRegistrationById,
  getRegistrationNavigation,
  getRegistrationHistory,
} from './generated/registrations/registrations';

export {
  getStudentSubmissionById,
  updateStudentSubmission,
  deleteStudentSubmission,
  getRegistrationDetail,
  updateRegistration,
  cancelRegistration,
  queryStudentSubmissions,
  createStudentSubmission,
  getMyRegistrations,
  createRegistration,
  getStudentSubmissionByRegistration,
  listCompetitions,
  getCompetitionDetail,
} from './generated/student/student';

export {
  getStudentById,
  updateStudent,
  deleteStudent,
  queryStudents,
  createStudent,
  batchDeleteStudents,
} from './generated/students/students';

export {
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  queryTeachers,
  createTeacher,
  batchDeleteTeachers,
} from './generated/teachers/teachers';

export { validateStudent } from './generated/validations/validations';

// 3. 自定义工具函数 (自动扫描 custom 目录)
export * from './custom/external';
export * from './custom/override';
