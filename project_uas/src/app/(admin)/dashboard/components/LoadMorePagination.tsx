"use client";
import React from "react";

interface PaginationProps {
  nextPage: () => void;
  isLoadingMore: boolean;
}

export default function PaginationComponent({
    nextPage,
    isLoadingMore
}: PaginationProps){
    return (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={nextPage}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Next Page"}
          </button>
        </div>
    );
}   