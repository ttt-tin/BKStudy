'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

import EditData from '../../components/EditInfoUser';
import UploadImage from '@components/UploadFile';

const USER_INFO = {
  info: [
    {
      title: 'Quyền truy cập',
      data: 'Giáo viên',
    },
    {
      title: 'Email',
      data: 'nguyenvana@gmail.com',
    },
    {
      title: 'Họ tên',
      data: 'Nguyễn Văn A'
    },
    {
      title: 'Ngày tháng năm sinh',
      data: '20/12/2000'
    },
    {
      title: 'Số điện thoại',
      data: '0123456789'
    },
  ],
  courses: [
    {
      course_name: 'Cấu trúc dữ liệu và giải thuật',
      description: 'Khóa học giúp rèn luyện tư duy về cấu trúc dữ liệu và các loại giải thuật, giúp sinh viên có thể giải quyết nhiều vấn đề khác nhau.',
      image: '/assets/images/course_image.jpg',
      href: '/dsa'
    },
    {
      course_name: 'Cấu trúc dữ liệu và giải thuật',
      description: 'Khóa học giúp rèn luyện tư duy về cấu trúc dữ liệu và các loại giải thuật, giúp sinh viên có thể giải quyết nhiều vấn đề khác nhau.',
      image: '/assets/images/course_image.jpg',
      href: '/dsa'
    },
    {
      course_name: 'Cấu trúc dữ liệu và giải thuật',
      description: 'Khóa học giúp rèn luyện tư duy về cấu trúc dữ liệu và các loại giải thuật, giúp sinh viên có thể giải quyết nhiều vấn đề khác nhau.',
      image: '/assets/images/course_image.jpg',
      href: '/dsa'
    },
    {
      course_name: 'Cấu trúc dữ liệu và giải thuật',
      description: 'Khóa học giúp rèn luyện tư duy về cấu trúc dữ liệu và các loại giải thuật, giúp sinh viên có thể giải quyết nhiều vấn đề khác nhau.',
      image: '/assets/images/course_image.jpg',
      href: '/dsa'
    }
  ]
}

const Profile = () => {

  const fileInputRef = useRef(null);
  const [userProfile, setUserProfile] = useState({})
  const [imageSelected, setImageSelected] = useState('');
  const [userInfo, setUserInfo] = useState([
    {
      title: 'Email',
      data: '',
    },
    {
      title: 'Họ tên',
      data: ''
    },
    {
      title: 'Ngày tham gia',
      data: ''
    },
    {
      title: 'Số điện thoại',
      data: ''
    },
  ])

  useEffect(() => {
    const token = localStorage.getItem("JWT");
    axios
      .get("http://localhost:8080/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        let user = data.data.user;
        handleDataUSer(user);
        setUserProfile(user)
      });
  }, []);

  const handleImageSelected = (imageURL) => {
    setImageSelected(imageURL);
  }

  const handleDataUSer = (user) => {
    if (user) {
      const newDataInfo = [...userInfo];
      newDataInfo[0].data = user.email;
      newDataInfo[1].data = user.fullname;
      newDataInfo[2].data = user.joinedDate.slice(0, 10);
      newDataInfo[3].data = user.phoneNumber;
      setUserInfo(newDataInfo);
    }
  }

  return (
    <div className='w-full'>
      <div className='relative w-full h-80 mt-4'>
        <div className='h-72 mx-8 rounded-3xl bg-blue-300'>
        </div>
        <div className='absolute bottom-0 left-40 flex justify-between'>
          <div className='w-40 h-40 rounded-full flex-center bg-white'>
            <Image
              className=""
              src="/assets/images/avatar.svg"
              alt="Profile Picture"
              width={130}
              height={130}
              priority
            />
          </div>
          <h2 className='pl-8 mt-20 text-3xl font-medium'>
            {userProfile.fullname}

          </h2>
        </div>
        <div className='absolute bottom-12 right-20 flex-between cursor-pointer'>
          <Image
            className=""
            src='/assets/icons/upload.svg'
            alt="Profile Picture"
            width={30}
            height={30}
            priority
          />
          <UploadImage title='Đổi ảnh bìa' className='text-xl ml-2 font-normal' fileType='image' />
        </div>
      </div>
      <div className='flex justify-between mx-16'>
        <div className='relative flex-col pt-8'>
          <div className='px-16 py-4 rounded-lg shadow-lg mb-8'>
            <h3 className='text-xl font-medium mb-3 border-b border-solid border-black'>Quyền truy cập</h3>
            <p className='text-base font-normal'>
              {userProfile ? (
                userProfile.isAdmin ? "Admin" : (
                  userProfile.userType === "LECTURER" ? "Giáo viên" : (
                    userProfile.userType === "STUDENT" ? "Sinh viên" : "Không xác định"
                  )
                )
              ) : null}
            </p>
          </div>
          <div className='w-full px-16 py-4 rounded-lg shadow-lg mb-8'>
            <h3 className='w-52 text-xl font-medium mb-3 border-b border-solid border-black'>Thông tin tài khoản</h3>
            <EditData infos={userInfo} />
          </div>
        </div>
        <div className='w-3/5 flex-col px-8 py-4'>
          <h4 className='w-72 text-2xl font-medium mb-3 border-b border-solid border-black'>Các khóa học đang học</h4>
          {userProfile && userProfile.courses && userProfile.courses.map((course, index) => (
            <Link href='/coursepage' key={index} className='flex-between px-8 py-4 rounded-lg shadow-lg mb-8 cursor-pointer transfrom-action'>
              <div className='w-[200px] relative h-[160px]'>
                <Image
                  className="rounded-2xl py-2"
                  src={'http://localhost:8080/' + course.courseId.imageUrl}
                  alt="Courses Picture"
                  fill
                  objectFit="cover"
                />
              </div>
              <div className='pl-4 w-[280px] h-[160px]'>
                <h3 className='w-full h-[30px] overflow-hidden text-xl font-medium mb-2'>{course.courseId.title}</h3>
                <p className='w-full h-[120px] overflow-hidden text-base font-normal'>{course.courseId.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>

  )
}

export default Profile