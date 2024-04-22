'use client'
import React, { useEffect, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getYTUploads } from './system/GetYTVideos';
import { classNames } from 'primereact/utils';
import { Checkbox } from 'primereact/checkbox';
import { GetDBVideos } from './system/GetDBVideos';
import { GetCategories } from './system/GetCategories';

const Datatable = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [videos, setVideos] = useState<Videos[]>([]);
    const [dbVideos, setDBVideos] = useState<Videos[]>([]);
    const [ytVideos, setYTVideos] = useState<Videos[]>([]);
    const [fromDB, setFromDB] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
    const [checked, setChecked] = useState<boolean>(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        title: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category: { value: null, matchMode: FilterMatchMode.CONTAINS },
        shortSuck: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [catagories] = useState<Category[]>([
        { value: 'True Crime' },
        { value: 'History' },
        { value: 'Serial Killer' },
        { value: 'Cult' },
        { value: 'Religion' },
        { value: 'Conspiracy' },
        { value: 'Science' },
        { value: 'Unsolved Mystery' },
        { value: 'Cryptids and Legends' },
        { value: 'Lady' },
        { value: 'Human Interest' }
    ]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth > 849 ? false : true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const isUploadTime = () => {
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();

            if (day === 1 || day === 5) {
                if (hour >= 12) {
                    return true;
                }
            }
            return false;
        }

        const getDBVideos = async () => {
            await GetDBVideos()
                .then(podcasts => {
                    setDBVideos(podcasts);                    
                })
                .catch(error => {
                    console.log(error);
                })
        }

        const getYTVideos = async () => {
            await getYTUploads()
                .then(podcasts => {
                    setYTVideos(podcasts);
                })
                .catch(error => {
                    console.log(error);
                });

        };
        const cachedData = localStorage.getItem('timeSuckCatalog');


        if (isUploadTime()) {
            getDBVideos();
            getYTVideos();
        }

        if (!isUploadTime) {
            if (cachedData) {
                console.log('cached')
                const parsedData: Videos[] = JSON.parse(cachedData);
                setVideos(parsedData);
            } else {
                setFromDB(true);
                getDBVideos();
            }
        }
    }, [])

    useEffect(() => {
        if (ytVideos.length !== 0) {
            if (dbVideos.length !== 0) {            
                if (dbVideos.length < ytVideos.length) {
                    setVideos(ytVideos);
                    GetCategories(videos);
                } else {
                    setVideos(dbVideos);
                }
            }
        }
    }, [ytVideos]);

    const allowExpansion = (rowData: Videos) => {
        return rowData.description.length > 0;
    };

    const rowExpansionTemplate = (data: Videos) => {
        return (
            <div className='p-3'>
                <h5>{data.title}</h5>
                <p>{data.description}</p>
            </div>
        )
    }

    let columns = [
        { field: 'position', header: '#' },
        { field: 'shortSuck', header: 'Short' },
        { field: 'category', header: 'Category' },
        { field: 'title', header: 'Title' }
    ]

    if (!isMobile) {
        columns.push(
            { field: 'upload_date', header: 'Upload Date' },
        )
    }

    columns.push(
        { field: 'videoId', header: '' }
    )

    const linkBodyTemplate = (rowData: Videos) => {
        return <a href={'/Watch/' + rowData.videoId}><i className='pi pi-play mr-3' /></a>
    }

    const categoryItemTemplate = (option: Category) => {
        return (
            <div className="flex">
                <span>{option.value}</span>
            </div>
        );
    };

    const shortSuckBodyTemplate = (rowData: Videos) => {
        if (rowData.shortSuck)
            return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.shortSuck, 'false-icon pi-times-circle': !rowData.shortSuck })}></i>;
    }

    const categoryRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        const selectedCategory = options?.value;

        return (
            <Dropdown
                id='categorySelect'
                value={options.value}
                options={catagories}
                itemTemplate={categoryItemTemplate}
                onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
                optionLabel="category"
                placeholder={selectedCategory ? selectedCategory : 'Filter Category'}
                className="flex"
                checkmark
                showClear
            />
        );
    };

    const shortSuckFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Checkbox checked={checked} onChange={e => { setChecked(!checked); options.filterApplyCallback(e.checked) }} />;
    }

    const onRowSelect = (event: { data: any }) => {
        // console.log(selectedItem)
    };


    return (
        <div>
            <DataTable
                value={videos}
                paginator
                rows={20}
                stripedRows
                sortField='upload_date'
                sortOrder={-1}
                filters={filters}
                loading={loading}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                filterDisplay="row"
                metaKeySelection={true}
                globalFilterFields={['category', 'title']}
                emptyMessage="No Sucks Found"
                tableStyle={{ minWidth: '5rem' }}
            >
                <Column expander={allowExpansion} style={{ width: '5rem' }} header="Expand" />
                {columns.map((col) => {
                    return (
                        (col.field === 'category') ?
                            <Column key={col.field}
                                field={col.field} header={col.header}
                                showFilterMenu={false} filter
                                filterElement={categoryRowFilterTemplate}
                            />
                            :
                            (col.field === 'title') ?
                                <Column key={col.field}
                                    field={col.field} header={col.header}
                                    showFilterMenu={false} filter
                                    filterField='title'
                                    filterPlaceholder='Search Title'
                                /> :
                                (col.field === 'videoId') ?
                                    <Column key={col.field}
                                        field={col.field} header={col.header}
                                        body={linkBodyTemplate}
                                    />
                                    :
                                    (col.field === 'shortSuck') ?
                                        <Column key={col.field}
                                            field={col.field} header={col.header}
                                            dataType='boolean'
                                            filter showFilterMenu={false}
                                            filterElement={shortSuckFilterTemplate}
                                            body={shortSuckBodyTemplate}
                                        />
                                        :

                                        <Column key={col.field} sortable field={col.field} header={col.header} />
                    )
                })
                }
            </DataTable>

        </div>
    )
}

export default Datatable
