import React from 'react';
import { useStore } from '../../store/useStore';

const TablesViewer = () => {
    const { currentFile } = useStore();
    const tables = currentFile?.tables || [];

    if (tables.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                No tables found in this document.
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6 space-y-8 bg-background">
            {tables.map((table, index) => (
                <div key={index} className="border border-border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-muted/50 px-4 py-2 border-b border-border text-sm font-medium flex justify-between items-center">
                        <span>Table {index + 1}</span>
                        <span className="text-xs text-muted-foreground">Page {table.page} • Confidence: {(table.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/20 text-muted-foreground uppercase text-xs">
                                <tr>
                                    {table.headers.map((header, i) => (
                                        <th key={i} className="px-4 py-3 font-medium border-b border-border">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="px-4 py-3 text-foreground">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TablesViewer;
