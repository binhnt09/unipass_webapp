import './home.scss';

import React from 'react';
// import { Alert, Col, Row } from 'react-bootstrap';
// import { Translate } from 'react-jhipster';
// import { Link } from 'react-router';
// import { useAppSelector } from 'app/config/store';
import { ShoppingBag, Shield, Users } from 'lucide-react';

export const Home = () => {
  // const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#0A2647] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Chợ trường an toàn của bạn</h1>
          <p className="text-xl text-white/90 mb-8">
            Giao dịch an toàn với bạn bè đã xác thực. Mua và bán sách giáo khoa, điện tử và nhiều hơn nữa trong cộng đồng trường đại học của
            bạn.
          </p>
          <button className="px-8 py-4 bg-[#FF6B35] hover:bg-[#FF5722] text-white rounded-lg font-medium transition-colors shadow-lg inline-flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Bắt đầu bán hàng
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Người dùng đã xác thực</h3>
              <p className="text-sm text-white/80">Chỉ sinh viên và giảng viên có email .edu đã xác thực</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Cộng đồng trường học</h3>
              <p className="text-sm text-white/80">Giao dịch với bạn bè trong trường đại học của bạn</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Giao dịch dễ dàng</h3>
              <p className="text-sm text-white/80">Quy trình mua bán đơn giản</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
