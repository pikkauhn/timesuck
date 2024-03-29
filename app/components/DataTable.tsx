'use client'
import React, { useEffect, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

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

interface Category {
    value: string,
}

const Datatable = () => {
    const defaultFilters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const [result, setResult] = useState<Item[] | undefined>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<Item[] | null>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category: { value: null , matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [catagories] = useState<string[]>([
        'True Crime',
        'History',
        'Serial Killer',
        'Cult / Religion',
        'Science / Conspiracy',
        'Unsolved Mystery',
        'Cryptids / Legends',
        'Lady Sucks',
        'Human Interest',
    ])

    useEffect(() => {
        const getResults = async () => {
            try {
                const podcasts = await fetch(process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/api/readPodcast', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(async (response) => {
                    if (!response.ok) {
                        console.error(`Failed to fetch data. Status: ${response.status}`)
                    }
                    else {
                        const podcastResponse = await response.json();
                        setResult(podcastResponse);
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
        getResults();

    }, [])

    const initFilters = () => {
        setFilters(defaultFilters);
        setGlobalFilterValue('');
    };

    const columns = [
        { field: 'episode_number', header: '#' },
        { field: 'category', header: 'Category' },
        { field: 'title', header: 'Title' },
        { field: 'run_time', header: 'Run Time' },
        { field: 'upload_date', header: 'Upload Date' },
    ]
    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const searchFilter = () => {
        const value = globalFilterValue;
        setFilters((prevFilters) => ({ ...prevFilters, global: { value, matchMode: FilterMatchMode.CONTAINS } }));
    }

    const categoryBodyTemplate = (rowData: Item) => {
        const category = rowData.catagory.value

        return (
            <div className="flex">
                <span>{category}</span>
            </div>
        );
    };

    const categoryItemTemplate = (option: string) => {
        return (
            <div className="flex">
                <span>{option}</span>
            </div>
        );
    };

    const categoryRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <Dropdown
                value={options.value} // Assuming options.value is already a string
                options={catagories}
                itemTemplate={categoryItemTemplate}
                onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
                optionLabel="category"
                placeholder="Filter Category"
                className="p-column-filter"
            />
        );
    };

    const onRowSelect = (event: { data: any }) => {

    };

    const renderHeader = () => {
        return (
            <div>
                <span>
                    <span className="p-input-icon-left">
                        <InputText id="employeeSearch" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                        <Button className="ml-2" type="button" icon="pi pi-search" label="Search" outlined onClick={searchFilter} />
                    </span>
                    <Button className="ml-2" type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                </span>
            </div>
        )
    }

    const header = renderHeader();

    return (
        <div>
            <DataTable
                value={result}
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
                metaKeySelection={false}
                globalFilterFields={['category', 'title']}
                header={header}
                emptyMessage="No Sucks Found"
                tableStyle={{ minWidth: '50rem' }}
            >
                {columns.map((col) => {
                    return (
                        (col.field === 'category') ?
                            <Column key={col.field} field={col.field} header={col.header} showFilterMenu={false} filter filterElement={categoryRowFilterTemplate} />
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
