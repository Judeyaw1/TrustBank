import { Car, DollarSign } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative mb-4">
        {/* Car Icon */}
        <Car className="h-16 w-16 text-[#3d2759] animate-bounce" />
        
        {/* Money Icon Animation */}
        <div className="absolute -right-4 -top-2 animate-ping">
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
        <div className="absolute -right-4 -top-2 animate-pulse">
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-[#3d2759] animate-pulse">Processing Transaction...</h3>
      <p className="text-sm text-gray-500">Please wait while we secure your transfer</p>
    </div>
  );
}

