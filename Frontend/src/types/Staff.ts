export interface Staff{
    id: number;
    staffCode:string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    email: string;
    address: string;

    staffType: string;   // DOCTOR, NURSE...
    position: string;     // Trưởng khoa, Bác sĩ...

    // Thông tin liên kết (đã làm phẳng)
    departmentName?: string; // Thay vì trả về cả object Department
    departmentId?: number;

    username: string;       // Lấy từ UserAccount
    active: string;
    hireDate: string;
} 
export interface Department{
    id: number;
    code: string;
    name: string;
}
export interface Role{
    id: number;
    code: string;
    name: string;
}