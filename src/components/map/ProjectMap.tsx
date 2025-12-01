'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Project, ProjectCategory } from '@/types/project';
import { Building2, MapPin } from 'lucide-react';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/icons/marker-icon-2x.png',
    iconUrl: '/icons/marker-icon.png',
    shadowUrl: '/icons/marker-shadow.png',
  });
}

// Nepal map configuration
const NEPAL_CENTER: [number, number] = [28.3949, 84.1240]; // Geographic center of Nepal
const DEFAULT_ZOOM = 7;

// Category colors (Purple palette matching brand)
const categoryColors: Record<ProjectCategory, string> = {
  'pile-testing': '#7c3aed',    // Purple-600
  'tunnel-road': '#6d28d9',     // Purple-700
  'hydropower': '#8b5cf6',      // Purple-500
  'transmission': '#5b21b6',    // Purple-800
  'ndt': '#6366f1'              // Indigo-500
};

const categoryLabels: Record<ProjectCategory, string> = {
  'pile-testing': 'Pile Testing',
  'tunnel-road': 'Tunnel & Road',
  'hydropower': 'Hydropower',
  'transmission': 'Transmission',
  'ndt': 'NDT'
};

interface ProjectMapProps {
  projects: Project[];
  highlightedProjectId?: string | null;
  onMarkerClick?: (projectId: string) => void;
  onMarkerHover?: (projectId: string | null) => void;
  className?: string;
}

/**
 * Create custom marker icon for a project
 */
function createCustomMarker(category: ProjectCategory, isHighlighted: boolean): L.DivIcon {
  const color = categoryColors[category];
  const size = isHighlighted ? 40 : 30;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        ${isHighlighted ? 'transform: scale(1.2);' : ''}
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
}

export default function ProjectMap({
  projects,
  highlightedProjectId,
  onMarkerClick,
  onMarkerHover,
  className = ''
}: ProjectMapProps) {
  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={NEPAL_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false} // We'll add custom position
        className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-lg shadow-lg z-0"
        style={{ background: '#f0f0f0' }}
        minZoom={6}
        maxZoom={18}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Zoom controls - positioned at top right */}
        <ZoomControl position="topright" />

        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          maxClusterRadius={50}
          spiderfyDistanceMultiplier={1.5}
          disableClusteringAtZoom={12}
          animate={true}
          animateAddingMarkers={true}
        >
          {projects.map((project) => {
            const isHighlighted = project.id === highlightedProjectId;
            const icon = createCustomMarker(project.category, isHighlighted);

            return (
              <Marker
                key={project.id}
                position={[project.location.coordinates.lat, project.location.coordinates.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onMarkerClick?.(project.id),
                  mouseover: () => onMarkerHover?.(project.id),
                  mouseout: () => onMarkerHover?.(null),
                }}
              >
                <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                  <div className="font-medium">{project.title}</div>
                </Tooltip>

                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="text-xs text-gray-500 mb-1">
                      {categoryLabels[project.category]}
                    </div>
                    <h3 className="font-bold text-sm mb-2">{project.title}</h3>
                    <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {project.client}
                    </div>
                    <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location.name}
                    </div>
                    <button
                      onClick={() => onMarkerClick?.(project.id)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Custom CSS for marker clusters */}
      <style jsx global>{`
        .marker-cluster {
          background-color: rgba(124, 58, 237, 0.6);
          border: 2px solid #7c3aed;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .marker-cluster div {
          background-color: rgba(124, 58, 237, 0.8);
          color: white;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-cluster-small {
          width: 30px;
          height: 30px;
        }

        .marker-cluster-small div {
          width: 24px;
          height: 24px;
          font-size: 11px;
        }

        .marker-cluster-medium {
          width: 40px;
          height: 40px;
        }

        .marker-cluster-medium div {
          width: 34px;
          height: 34px;
          font-size: 13px;
        }

        .marker-cluster-large {
          width: 50px;
          height: 50px;
        }

        .marker-cluster-large div {
          width: 44px;
          height: 44px;
          font-size: 15px;
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
