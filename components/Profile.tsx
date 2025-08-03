"use client"
import React from 'react';
import Image from 'next/image';

const Profile = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 'clamp(10px, 2vw, 20px)',
        right: 'clamp(10px, 2vw, 20px)',
        zIndex: 9999
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Profile Image Container */}
        <div 
          style={{
            width: 'clamp(120px, 15vw, 240px)',
            height: 'clamp(120px, 15vw, 240px)',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.05)'
          }}
          onClick={() => {
            // Scroll to Hero section or add your own navigation
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
          }}
        >
          <div 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden'
            }}
          >
            <Image
              src="/myimg-Photoroom.png"
              alt="Tejeswar Profile"
              width={240}
              height={240}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              priority
            />
          </div>
        </div>
        
        {/* Hover Tooltip */}
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: 'clamp(8px, 1.5vw, 12px)',
            padding: 'clamp(8px, 2vw, 18px) clamp(12px, 2.5vw, 18px)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            fontSize: 'clamp(14px, 2vw, 18px)',
            borderRadius: '12px',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
          className="tooltip"
        >
          Tejeswar
        </div>
      </div>
      
      <style jsx>{`
        div:hover .tooltip {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Profile;