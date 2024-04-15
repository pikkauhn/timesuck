'use client'
import React, { useEffect, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { getUploads } from './system/RetrieveUploads';
import { TriStateCheckbox, TriStateCheckboxChangeEvent} from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

interface Item {
    id: string,
    catagory: Category,
    episode_number: number,
    title: string,
    description: string,
    run_time: string,
    upload_date: Date,
    link: string
}

interface Videos {
    title: string;
    description: string;
    videoId: string;
    upload_date: string;
    position: number;
    shortSuck: boolean;
}

interface Category {
    value: string,
}

const Datatable = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [result, setResult] = useState<Item[] | undefined>([]);
    const [videos, setVideos] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item[] | null>(null);
    const [checked, setChecked] = useState<boolean>(false);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        title: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        { value: 'Cryptids' },
        { value: 'Legends' },
        { value: 'Lady Sucks' },
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
        const getVideoUploads = async () => {
            getUploads()
                .then(podcasts => {
                    setVideos(podcasts);
                })
                .catch(error => {
                    console.log(error);
                })
        };
        if (videos.length < 1) {            
            getVideoUploads();
        }
    }, [])

    let columns = [
        { field: 'position', header: '#' },
        { field: 'shortSuck', header: 'Short'},
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
        return <a href={'/Watch/'+rowData.videoId}><i className='pi pi-play mr-3' /></a>
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
        return <Checkbox checked={checked} onChange={e => {setChecked(!checked); options.filterApplyCallback(e.checked)}}  />;    
    }

    const onRowSelect = (event: { data: any }) => {
        // console.log(selectedItem)
    };

    const renderHeader = () => {
        return (
            <div>
                {/* <Button className="ml-2" type="button" label="TEST" outlined onClick={getVideoUploads} /> */}
            </div>
        )
    }

    const header = renderHeader();

    return (
        <div>
            <DataTable
                value={videos}                
                paginator
                rows={20}
                stripedRows
                sortField='episode_number'
                sortOrder={-1}
                filters={filters}
                loading={loading}
                filterDisplay="row"
                selectionMode="single"
                selection={selectedItem ? selectedItem : null}
                onSelectionChange={(e) => setSelectedItem(e.value as Item[])}
                onRowSelect={onRowSelect}
                metaKeySelection={true}
                globalFilterFields={['category', 'title']}
                header={header}
                emptyMessage="No Sucks Found"
                tableStyle={{ minWidth: '5rem' }}
            >
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
