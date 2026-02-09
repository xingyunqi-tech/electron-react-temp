import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { teacherLogin, studentLogin, getTeacherById, getStudentById } from '@/api';
import type { LoginRequest, LoginResponse, TeacherDto, StudentDto } from '@/api';
import storage from '@/plugins/storage';
import { piniaStorage } from '@/store/plugins/persist';

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

/**
 * 用户类型: 教师或学生
 */
export type UserType = 'teacher' | 'student';

/**
 * 统一的用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  id: number | undefined;
  /** 用户名（教师工号/学生学号） */
  username: string;
  /** 真实姓名 */
  realName: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone: string;
  /** 用户角色 */
  role: string;
  /** 用户类型 */
  userType: UserType | '';
  /** 学号（学生专属） */
  studentNo: string;
  /** 专业（学生专属） */
  major: string;
  /** 所属院系（教师专属） */
  department: string;
  /** 状态: 0-禁用 1-启用 */
  status: number;
}

/**
 * 初始状态
 */
const initialState: UserInfo = {
  id: undefined,
  username: '',
  realName: '',
  email: '',
  phone: '',
  role: '',
  userType: '',
  studentNo: '',
  major: '',
  department: '',
  status: 1,
};

/**
 * 用户状态管理 Store
 *
 * 设计原则：
 * 1. Token 独立存储 - 只存 localStorage，不在 Store 中持久化
 * 2. 统一 setter - 使用 setUserInfo 统一更新
 * 3. 类型安全 - 完整的 TypeScript 类型定义
 * 4. 支持教师/学生双角色登录
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // ==================== 状态定义 ====================

    /** 用户ID */
    const id = ref<number | undefined>(initialState.id);
    /** 用户名（教师工号/学生学号） */
    const username = ref<string>(initialState.username);
    /** 真实姓名 */
    const realName = ref<string>(initialState.realName);
    /** 用户邮箱 */
    const email = ref<string>(initialState.email);
    /** 手机号 */
    const phone = ref<string>(initialState.phone);
    /** 用户角色 */
    const role = ref<string>(initialState.role);
    /** 用户类型 */
    const userType = ref<UserType | ''>(initialState.userType);
    /** 学号（学生专属） */
    const studentNo = ref<string>(initialState.studentNo);
    /** 专业（学生专属） */
    const major = ref<string>(initialState.major);
    /** 所属院系（教师专属） */
    const department = ref<string>(initialState.department);
    /** 状态 */
    const status = ref<number>(initialState.status);

    // ==================== 计算属性 ====================

    /** 完整用户信息对象 (只读快照) */
    const userInfo = computed<UserInfo>(() => ({
      id: id.value,
      username: username.value,
      realName: realName.value,
      email: email.value,
      phone: phone.value,
      role: role.value,
      userType: userType.value,
      studentNo: studentNo.value,
      major: major.value,
      department: department.value,
      status: status.value,
    }));

    /** 获取 token（从 localStorage 读取） */
    const token = computed(() => storage('localStorage').get('token') || '');

    /** 是否已登录 */
    const isLoggedIn = computed(() => !!token.value);

    /** 是否是管理员 */
    const isAdmin = computed(() => role.value === UserRole.ADMIN);

    /** 是否是教师 */
    const isTeacher = computed(() => role.value === UserRole.TEACHER || role.value === UserRole.ADMIN);

    /** 是否是学生 */
    const isStudent = computed(() => role.value === UserRole.STUDENT);

    // ==================== Actions ====================

    /**
     * 设置 Token
     */
    const setToken = (value: string) => {
      storage('localStorage').set('token', value);
    };

    /**
     * 清除 Token
     */
    const clearToken = () => {
      storage('localStorage').remove('token');
    };

    /**
     * 设置用户信息（部分更新）
     * @param info 要更新的用户信息字段
     */
    const setUserInfo = (info: Partial<UserInfo>) => {
      if (info.id !== undefined) id.value = info.id;
      if (info.username !== undefined) username.value = info.username;
      if (info.realName !== undefined) realName.value = info.realName;
      if (info.email !== undefined) email.value = info.email;
      if (info.phone !== undefined) phone.value = info.phone;
      if (info.role !== undefined) role.value = info.role;
      if (info.userType !== undefined) userType.value = info.userType;
      if (info.studentNo !== undefined) studentNo.value = info.studentNo;
      if (info.major !== undefined) major.value = info.major;
      if (info.department !== undefined) department.value = info.department;
      if (info.status !== undefined) status.value = info.status;
    };

    /**
     * 从教师 DTO 设置用户信息
     */
    const setUserInfoFromTeacher = (teacher: TeacherDto, loginResponse: LoginResponse) => {
      setUserInfo({
        id: teacher.id ?? loginResponse.userId,
        username: loginResponse.username ?? '',
        realName: teacher.name ?? loginResponse.realName ?? '',
        email: teacher.email ?? '',
        phone: teacher.phone ?? '',
        role: teacher.role ?? loginResponse.role ?? UserRole.TEACHER,
        userType: 'teacher',
        department: teacher.department ?? '',
        status: teacher.status ?? 1,
        // 清空学生专属字段
        studentNo: '',
        major: '',
      });
    };

    /**
     * 从学生 DTO 设置用户信息
     */
    const setUserInfoFromStudent = (student: StudentDto, loginResponse: LoginResponse) => {
      setUserInfo({
        id: student.id ?? loginResponse.userId,
        username: loginResponse.username ?? '',
        realName: student.name ?? loginResponse.realName ?? '',
        email: student.email ?? '',
        phone: student.phone ?? '',
        role: loginResponse.role ?? UserRole.STUDENT,
        userType: 'student',
        studentNo: student.studentNo ?? '',
        major: student.major ?? '',
        status: student.status ?? 1,
        // 清空教师专属字段
        department: '',
      });
    };

    /**
     * 重置用户信息为初始状态
     */
    const resetUserInfo = () => {
      id.value = initialState.id;
      username.value = initialState.username;
      realName.value = initialState.realName;
      email.value = initialState.email;
      phone.value = initialState.phone;
      role.value = initialState.role;
      userType.value = initialState.userType;
      studentNo.value = initialState.studentNo;
      major.value = initialState.major;
      department.value = initialState.department;
      status.value = initialState.status;
    };

    /**
     * 教师登录
     * @param credentials 登录凭证
     * @returns token
     */
    const teacherLoginAction = async (credentials: LoginRequest) => {
      // mutator 自动提取 data 字段，返回的是 LoginResponse
      const loginData = await teacherLogin({
        username: credentials.username.trim(),
        password: credentials.password,
      });

      if (!loginData?.token) {
        throw new Error('登录失败：未获取到token');
      }

      setToken(loginData.token);

      // 设置基本用户信息
      setUserInfo({
        id: loginData.userId,
        username: loginData.username ?? '',
        realName: loginData.realName ?? '',
        role: loginData.role ?? UserRole.TEACHER,
        userType: 'teacher',
      });

      return loginData.token;
    };

    /**
     * 学生登录
     * @param credentials 登录凭证
     * @returns token
     */
    const studentLoginAction = async (credentials: LoginRequest) => {
      // mutator 自动提取 data 字段，返回的是 LoginResponse
      const loginData = await studentLogin({
        username: credentials.username.trim(),
        password: credentials.password,
      });

      if (!loginData?.token) {
        throw new Error('登录失败：未获取到token');
      }

      setToken(loginData.token);

      // 设置基本用户信息
      setUserInfo({
        id: loginData.userId,
        username: loginData.username ?? '',
        realName: loginData.realName ?? '',
        role: loginData.role ?? UserRole.STUDENT,
        userType: 'student',
      });

      return loginData.token;
    };

    /**
     * 获取用户详细信息
     * 根据用户类型调用不同的 API
     */
    const getInfoAction = async () => {
      if (!id.value) {
        throw new Error('用户ID不存在');
      }

      if (userType.value === 'teacher') {
        // mutator 自动提取 data 字段，返回的是 TeacherDto
        const teacherData = await getTeacherById(id.value);
        if (teacherData) {
          setUserInfoFromTeacher(teacherData, {
            userId: id.value,
            username: username.value,
            realName: realName.value,
            role: role.value,
          });
        }
        return teacherData;
      } else if (userType.value === 'student') {
        // mutator 自动提取 data 字段，返回的是 StudentDto
        const studentData = await getStudentById(id.value);
        if (studentData) {
          setUserInfoFromStudent(studentData, {
            userId: id.value,
            username: username.value,
            realName: realName.value,
            role: role.value,
          });
        }
        return studentData;
      }

      throw new Error('未知的用户类型');
    };

    /**
     * 退出登录
     */
    const logoutAction = async () => {
      // 清除 token
      clearToken();
      // 重置用户信息
      resetUserInfo();
      // 清空 IndexedDB 中的持久化数据
      await piniaStorage.removeItem('user');
    };

    return {
      // 状态
      id,
      username,
      realName,
      email,
      phone,
      role,
      userType,
      studentNo,
      major,
      department,
      status,

      // 计算属性
      userInfo,
      token,
      isLoggedIn,
      isAdmin,
      isTeacher,
      isStudent,

      // Actions
      setToken,
      clearToken,
      setUserInfo,
      setUserInfoFromTeacher,
      setUserInfoFromStudent,
      resetUserInfo,
      teacherLoginAction,
      studentLoginAction,
      getInfoAction,
      logoutAction,
    };
  },
  {
    persist: true,
  },
);
