import React from 'react';
import './loading.css';

export default function Loading() {
  return (
    <div className="loading-spinner">
      <div>
        <div className="lds-dual-ring"></div>
        <p>Loading, please wait</p>
      </div>
    </div>
  );
}
