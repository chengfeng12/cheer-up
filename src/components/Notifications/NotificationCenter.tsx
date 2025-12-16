import React from 'react';
import ErrorToast from './ErrorToast';

// 简化后的通知中心 - 只显示一个错误提示
const NotificationCenter: React.FC = () => {
  return <ErrorToast />;
};

export default NotificationCenter;