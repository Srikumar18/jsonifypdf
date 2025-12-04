import { create } from 'zustand';

export const useStore = create((set, get) => ({
    /* ----------------------------
       UI TAB STATE
    ---------------------------- */
    activeTab: 'summary',
    setActiveTab: (tab) => set({ activeTab: tab }),

    /* ----------------------------
       FILE LIST (just names/timestamps)
    ---------------------------- */
    files: [],

    /* ----------------------------
       SESSION STORAGE
       - full extracted results
       - matches fileId
    ---------------------------- */
    sessions: [],

    currentFile: null,

    /* Save extracted backend result */
    addSession: (fileId, data) =>
        set((state) => ({
            sessions: [...state.sessions, { fileId, data }],
            currentFile: data,
            currentPage: 1, // reset page view
        })),

    /* Load previously processed file */
    loadSession: (fileId) => {
        const session = get().sessions.find((s) => s.fileId === fileId);
        if (session) {
            set({
                currentFile: session.data,
                currentPage: 1, // reset to page 1 always
            });
        }
    },

    setCurrentFile: (data) =>
        set({
            currentFile: data,
            currentPage: 1,
        }),

    /* ----------------------------
       SIDEBAR
    ---------------------------- */
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    /* ----------------------------
       PDF VIEW STATE
    ---------------------------- */
    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page }),

    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    /* ----------------------------
       PDF VIEWER MODAL 
       Supports passing "start page"
    ---------------------------- */
    pdfViewerOpen: false,
    pdfViewerUrl: null,
    pdfViewerTitle: null,
    pdfViewerPage: 1,

    openPDFViewer: (url, title, page = 1) =>
        set({
            pdfViewerOpen: true,
            pdfViewerUrl: url,
            pdfViewerTitle: title,
            pdfViewerPage: page,
        }),

    closePDFViewer: () =>
        set({
            pdfViewerOpen: false,
            pdfViewerUrl: null,
            pdfViewerTitle: null,
            pdfViewerPage: 1,
        }),

    /* ----------------------------
       FILE UPLOADING
    ---------------------------- */
    uploadFile: (file) => {
        const id = Math.random().toString(36).substr(2, 9);

        set((state) => ({
            files: [
                {
                    id,
                    name: file.name,
                    date: new Date().toISOString().split('T')[0],
                },
                ...state.files,
            ],
        }));

        return id; // return fileId so backend response can link it
    },
}));
