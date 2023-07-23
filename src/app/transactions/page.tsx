/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from 'react';
import { Seller, Transactions } from './type';
import { useRouter } from 'next/navigation';
import { getAuthAccess, setAuthAccess } from '../Auth';
import Legend from '../components/Legend';
import Image from 'next/image';
import { faker } from '@faker-js/faker';

const TransactionsTypeColors: Record<number, string> = {
  1: 'bg-green-400',
  2: 'bg-blue-400',
  3: 'bg-red-400',
  4: 'bg-yellow-400',
};

const TransactionTypeLegend: Record<number, string> = {
  1: 'Venda Criador',
  2: 'Venda Afiliado',
  3: 'Comissão Paga',
  4: 'Comissão Recebida',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [access, setAccess] = useState<string | null>(null);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!getAuthAccess()) {
      router.push('/');
    } else {
      setAccess(getAuthAccess());
    }
  }, []);

  useEffect(() => {
    if (access) {
      fetchTransactions();
      fetchSellers();
    }
  }, [access, selectedSeller]);

  const logout = () => {
    setAuthAccess('');
    router.push('/');
  };

  const fetchTransactions = async (url?: string) => {
    try {
      setLoading(true);
      let apiUrl = url || `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/`;
      if (selectedSeller) {
        apiUrl += `${selectedSeller}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      if (response.status === 401) {
        logout();
      }
      const data = await response.json();
      setTotal(data.total);
      setTransactions(data.transactions);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sellers`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch sellers');
      }
      const data = await response.json();
      setSellers(data);
    } catch (error: any) {
      setError(error.message);
    }
  };
  const handleSellerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sellerId = event.target.value ? event.target.value : null;
    setSelectedSeller(sellerId);
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access}`,
            },
            body: formData,
          },
        );
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        fetchTransactions();
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchTransactions(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchTransactions(previousPage);
    }
  };

  const formatCurrency = (value: number): string => {
    const valueReal = value / 100.0;
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formatter.format(valueReal);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  console.log(transactions);

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="flex justify-between my-14">
        <div className="flex-col justify-between">
          <h1 className="text-3xl font-bold mb-6">Transações</h1>

          <div className=" items-center mt-6">
            <label htmlFor="seller" className="mr-2">
              Vendedor:
            </label>
            <select
              id="seller"
              value={selectedSeller || ''}
              onChange={handleSellerChange}
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-zinc-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-zinc-100 dark:text-gray-500 dark:border-gray-600  dark:hover:border-zinc-100 dark:focus:ring-gray-700"
            >
              <option value="">---------------</option>
              {sellers?.length > 0 &&
                sellers.map((seller) => (
                  <option key={seller.id} value={seller.id} className="my-2">
                    {seller.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex-col">
          <div className=" justify-end mb-4">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded duration-200"
              onClick={logout}
            >
              Sair
            </button>
          </div>

          <div className=" justify-end mb-4">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded duration-200"
              onClick={handleUploadButtonClick}
            >
              Enviar Arquivo
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          <div className=" justify-end mb-4">
            <div className="bg-slate-500 text-white font-bold py-2 px-4 rounded">
              Total: {formatCurrency(total)}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg flex items-center justify-center min-h-[500px]">
        {transactions?.length ? (
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-300 mb-5">
            <thead className="text-xs text-gray-700 uppercase bg-gray-500 dark:bg-purple-900 dark:text-zinc-100">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3">
                  Pagamento
                </th>
                <th scope="col" className="px-6 py-3">
                  Data
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipo de Venda
                </th>
              </tr>
            </thead>
            <tbody className="text-black ">
              {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={
                    'bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200'
                  }
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <p className="w-4 h-4 text-blue-600   " />
                      {index + 1}
                    </div>
                  </td>

                  <th scope="row" className="flex items-center px-6 py-4  ">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={faker.image.business(40, 40, true)}
                      alt=""
                    />
                    <div className="pl-3">
                      <div className="text-base text-left font-semibold">
                        {transaction.sellerName}
                      </div>
                      <div className="font-normal text-gray-500">
                        {transaction.sellerType === 1
                          ? `${transaction.sellerName
                              .toLowerCase()
                              .split(' ')
                              .join('.')}@criador.com`
                          : `${transaction.sellerName
                              .toLowerCase()
                              .split(' ')
                              .join('_')}@afiliados.com`}
                      </div>
                    </div>
                  </th>

                  <td className="px-6 py-4 border-b text-center">
                    {transaction.product}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {formatCurrency(transaction.value)}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <Legend
                      items={TransactionTypeLegend}
                      colors={TransactionsTypeColors}
                      transactionType={transaction.transactionType}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <strong className="text-4xl mt-20 font-sans">
            Nenhuma Transação
          </strong>
        )}
      </div>
    </div>
  );
}
