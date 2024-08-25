export const emptyOrRows = (rows:number) => {
    if (!rows)
        return [];
    return rows;
};

export const getOffset = (currentPage:number = 1, listPerPage:number) => {
    return (currentPage - 1) * listPerPage; 
}

