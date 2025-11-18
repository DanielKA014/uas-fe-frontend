"use client";
import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationComponent({
    totalPages,
    currentPage,
    onPageChange
}: PaginationProps){

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="btn-group">
                {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    className={`btn ${
                    currentPage === i + 1
                        ? "btn-danger text-white"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </button>
                ))}
            </div>
        </div>
    );
}   