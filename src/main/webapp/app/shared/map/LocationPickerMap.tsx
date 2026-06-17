import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LocateFixed } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in leaflet with webpack
// Using unpkg CDN to bypass Webpack png loader issues
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number, addressText: string) => void;
}

const LocationMarker = ({ position, setPosition, onLocationSelect }: any) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      fetchAddress(lat, lng).then(address => {
        onLocationSelect(lat, lng, address);
      });
    },
  });

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`);
      const data = await response.json();
      return data.display_name || '';
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          fetchAddress(pos.lat, pos.lng).then(address => {
            onLocationSelect(pos.lat, pos.lng, address);
          });
        },
      }}
    />
  );
};

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ initialLat, initialLng, onLocationSelect }) => {
  const defaultCenter = { lat: 21.01319, lng: 105.52628 }; // Default to FPT University Hoa Lac
  const center = initialLat && initialLng ? { lat: initialLat, lng: initialLng } : defaultCenter;
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initialLat && initialLng ? center : null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setPosition(newPos);
          // fetch address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`)
            .then(res => res.json())
            .then(data => {
              onLocationSelect(latitude, longitude, data.display_name || '');
            })
            .catch(() => {
              onLocationSelect(latitude, longitude, '');
            });
        },
        error => {
          console.warn('Geolocation failed or denied, using initial location.', error);
          if (initialLat && initialLng) {
            setPosition({ lat: initialLat, lng: initialLng });
          } else {
            setPosition(defaultCenter);
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị.');
      if (initialLat && initialLng) {
        setPosition({ lat: initialLat, lng: initialLng });
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=vn&accept-language=vi&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPos);
        onLocationSelect(newPos.lat, newPos.lng, display_name);
      } else {
        alert('Không tìm thấy địa điểm trên OpenStreetMap. Vui lòng sử dụng địa chỉ cụ thể hơn hoặc kéo thả ghim trên bản đồ.');
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm địa điểm..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B35] text-sm"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2 bg-[#0A2647] text-white rounded-lg hover:bg-[#144272] disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </form>
      <div className="relative h-[300px] w-full rounded-lg overflow-hidden border border-gray-300">
        <button
          type="button"
          onClick={handleMyLocation}
          title="Vị trí của tôi"
          className="absolute top-[80px] left-[10px] z-[1000] bg-white text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center transition-colors"
          style={{
            width: '34px',
            height: '34px',
            border: '2px solid rgba(0,0,0,0.2)',
            backgroundClip: 'padding-box',
            boxShadow: 'none',
          }}
        >
          <LocateFixed className="w-4 h-4 text-[#0A2647]" />
        </button>
        <MapContainer center={center} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 0 }}>
          {/* Using Google Maps tiles instead of OpenStreetMap tiles for UI/UX */}
          <TileLayer attribution="&copy; Google Maps" url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />
          <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500 italic">
        Nhấp vào bản đồ hoặc kéo thả ghim để chọn vị trí chính xác. Lat: {initialLat}, Lng: {initialLng}
      </p>
    </div>
  );
};
