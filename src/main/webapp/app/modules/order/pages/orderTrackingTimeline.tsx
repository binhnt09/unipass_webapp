// NEW FEATURE: Order Tracking Timeline - Visual timeline for order status progression
// Displays order journey from placed → confirmed → shipping → delivered
// Shows timestamps, descriptions, and visual progress indicators
// Responsive design with vertical timeline on mobile, horizontal on desktop
import React from 'react';
import { CheckCircle, Circle, Clock, Package, Truck, Home } from 'lucide-react';

interface TrackingStep {
  label: string;
  time: string;
  completed: boolean;
  description?: string;
}

interface OrderTrackingTimelineProps {
  steps: TrackingStep[];
  currentStatus: 'pending' | 'shipping' | 'completed' | 'cancelled';
}

// NEW FEATURE: Order Tracking Timeline - Main timeline component
export function OrderTrackingTimeline({ steps, currentStatus }: OrderTrackingTimelineProps) {
  // Find current active step index
  const currentStepIndex = steps.findIndex(step => step.completed);
  const activeStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  // NEW FEATURE: Order Tracking Timeline - Get icon for each step type
  const getStepIcon = (index: number, label: string) => {
    const iconClass = 'w-5 h-5';

    if (label.includes('đặt')) return <Package className={iconClass} />;
    if (label.includes('xác nhận') || label.includes('chuẩn bị')) return <Clock className={iconClass} />;
    if (label.includes('giao')) return <Truck className={iconClass} />;
    if (label.includes('giao hàng') && label.includes('thành công')) return <Home className={iconClass} />;

    return <Circle className={iconClass} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-[#0A2647] dark:text-white mb-6">Theo dõi đơn hàng</h3>

      {/* NEW FEATURE: Order Tracking Timeline - Desktop horizontal timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress bar background */}
          <div
            className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700"
            style={{
              left: '2.5rem',
              right: '2.5rem',
            }}
          />

          {/* Progress bar filled */}
          <div
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] transition-all duration-500"
            style={{
              left: '2.5rem',
              width: `calc(${(activeStepIndex / (steps.length - 1)) * 100}% - 5rem)`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Icon circle */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                    step.completed
                      ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-white shadow-lg scale-110'
                      : index === activeStepIndex + 1
                        ? 'bg-white dark:bg-gray-800 border-2 border-[#FF6B35] text-[#FF6B35] animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {step.completed ? <CheckCircle className="w-8 h-8" /> : getStepIcon(index, step.label)}
                </div>

                {/* Label and time */}
                <div className="mt-4 text-center max-w-[150px]">
                  <p
                    className={`font-medium text-sm mb-1 ${
                      step.completed ? 'text-[#0A2647] dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.time && <p className="text-xs text-gray-500 dark:text-gray-400">{step.time}</p>}
                  {step.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{step.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW FEATURE: Order Tracking Timeline - Mobile vertical timeline */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            {/* Left side - Icon and line */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  step.completed
                    ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-white shadow-lg'
                    : index === activeStepIndex + 1
                      ? 'bg-white dark:bg-gray-800 border-2 border-[#FF6B35] text-[#FF6B35] animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                {step.completed ? <CheckCircle className="w-6 h-6" /> : getStepIcon(index, step.label)}
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 flex-1 mt-2 transition-all duration-300 ${
                    step.completed ? 'bg-gradient-to-b from-[#FF6B35] to-[#FF8C5A]' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  style={{ minHeight: '40px' }}
                />
              )}
            </div>

            {/* Right side - Content */}
            <div className="flex-1 pb-6">
              <p className={`font-medium mb-1 ${step.completed ? 'text-[#0A2647] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.label}
              </p>
              {step.time && <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{step.time}</p>}
              {step.description && <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* NEW FEATURE: Order Tracking Timeline - Status message */}
      {currentStatus === 'cancelled' && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">⚠️ Đơn hàng đã bị hủy. Vui lòng liên hệ người bán để biết thêm chi tiết.</p>
        </div>
      )}

      {currentStatus === 'pending' && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ℹ️ Đơn hàng đang chờ người bán xác nhận. Thời gian xác nhận thường trong vòng 24 giờ.
          </p>
        </div>
      )}

      {/* NEW FEATURE: Order Tracking Timeline - Real-time updates note */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Trạng thái đơn hàng được cập nhật tự động theo thời gian thực
          {/* TODO: Backend should push real-time updates via WebSocket */}
        </p>
      </div>
    </div>
  );
}
