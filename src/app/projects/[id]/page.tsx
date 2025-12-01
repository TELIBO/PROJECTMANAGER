'use client';

import React, { useState } from 'react';
import ProjectHeader from '../ProjectHeader';
import Board from '../BoardView';
import Timeline from '../TimelineView';
import  Table from '../TableView';
import ModalNewTask from '@/components/ModelNewTask';
import {getTasks} from '@/lib/task';
type Props = {
    params: { id: string };
};

const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModelNewTaskOpen, setIsModelNewTaskOpen] = useState(false);
    return (
        <div>
            <ModalNewTask
            isOpen={isModelNewTaskOpen}
            onClose={() => setIsModelNewTaskOpen(false)}
            id={id}/>
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {
            activeTab === "Board" && (
           <Board id={id} setIsModalNewTaskOpen={setIsModelNewTaskOpen} />
            )
            }
     
                 /* {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModelNewTaskOpen} />
      )} */
        </div>
    );
};

export default Project;
