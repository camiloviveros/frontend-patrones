// src/app/structures/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { 
  fetchArrayData, fetchLinkedListData, fetchDoubleLinkedListData,
  fetchCircularDoubleLinkedListData, fetchStackData, fetchQueueData, fetchTreeData 
} from '../../lib/api';
import ArrayVisualization from '../components/datastructures/ArrayVisualization';
import LinkedListVisualization from '../components/datastructures/LinkedListVisualization';
import DoubleLinkedListVisualization from '../components/datastructures/DoubleLinkedListVisualization';
import CircularDoubleLinkedListVisualization from '../components/datastructures/CircularDoubleLinkedListVisualization';
import StackVisualization from '../components/datastructures/StackVisualization';
import QueueVisualization from '../components/datastructures/QueueVisualization';
import TreeVisualization from '../components/datastructures/TreeVisualization';

export default function StructuresPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    array: [],
    linkedList: [],
    doubleLinkedList: [],
    circularDoubleLinkedList: [],
    stack: [],
    queue: [],
    tree: { value: null, children: [] }
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          array,
          linkedList,
          doubleLinkedList,
          circularDoubleLinkedList,
          stack,
          queue,
          tree
        ] = await Promise.all([
          fetchArrayData(),
          fetchLinkedListData(),
          fetchDoubleLinkedListData(),
          fetchCircularDoubleLinkedListData(),
          fetchStackData(),
          fetchQueueData(),
          fetchTreeData()
        ]);

        setData({
          array,
          linkedList,
          doubleLinkedList,
          circularDoubleLinkedList,
          stack,
          queue,
          tree
        });
      } catch (error) {
        console.error('Error fetching structure data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Visualización de Estructuras de Datos
      </h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Array</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ArrayVisualization data={data.array} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Lista Enlazada Simple</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <LinkedListVisualization data={data.linkedList} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Lista Doblemente Enlazada</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <DoubleLinkedListVisualization data={data.doubleLinkedList} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Lista Doblemente Enlazada Circular</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CircularDoubleLinkedListVisualization data={data.circularDoubleLinkedList} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Pila (Stack)</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <StackVisualization data={data.stack} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Cola (Queue)</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <QueueVisualization data={data.queue} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Árbol</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TreeVisualization data={data.tree} />
          </div>
        </section>
      </div>
    </div>
  );
}