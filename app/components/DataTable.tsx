'use client'
import React, { useEffect, useState } from 'react'
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/navigation';

interface Item {
    id: String,
    catagory: String,
    episode_number: Number,
    title: String,
    description: String,
    run_time: Number,
    upload_date: Date,
    link: String
}

const Datatable = () => {
    const router = useRouter();
    const defaultFilters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const [result, setResult] = useState<Item[] | undefined>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedItem, setSelectedItem] = useState<Item[] | null>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const getResults = async () => {
            try {
                const bins = await fetch(process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/api/readPodcast', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(async (response) => {
                    if (!response.ok) {
                        console.error(`Failed to fetch data. Status: ${response.status}`)
                    }               
                    else {
                        console.log(response)
                        const binResponse = await response.json();
                        setResult(binResponse);
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
        { field: 'location.address', header: 'Location' },
        { field: 'last_emptied_at', header: 'Last Emptied' },
        { field: 'type', header: 'Type' },
        { field: 'status', header: 'Status' },
        { field: 'charge', header: 'Charge' },

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

    const onRowSelect = (event: { data: any }) => {
        router.replace(`/Data/${event.data.id}`);
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
                filters={filters}
                loading={loading}
                filterDisplay="row"
                selectionMode="single"
                selection={selectedItem ? selectedItem : null}
                onSelectionChange={(e) => setSelectedItem(e.value as Item[])}
                onRowSelect={onRowSelect}
                metaKeySelection={false}
                globalFilterFields={['BinID', 'Capacity', 'Location', 'Status', 'LastEmptied', 'Charge']}
                header={header}
                emptyMessage="No Bins Found"
                tableStyle={{ minWidth: '50rem' }}
            >
                {columns.map((col) => {
                    return (
                        <Column key={col.field} sortable field={col.field} header={col.header} />
                    )
                })
                }
            </DataTable>

        </div>
    )
}

export default Datatable
