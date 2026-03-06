import React, { Fragment } from 'react';
import List from '@mui/material/List';
import { ListItem, ListSubheader } from '@material-ui/core';
import { components } from '../../../types/openapi';
import { StepStatusBadge } from '../../molecules/StepStatusBadge';

type StepListProps = {
  execution: components['schemas']['TestWorkflowExecution'];
  onStepClick(stepRef: string): void;
};

export const StepList: React.FC<StepListProps> = ({
  execution,
  onStepClick,
}) => (
  <List
    component="nav"
    id="steps"
    aria-labelledby="nested-list-subheader"
    subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        Steps:
      </ListSubheader>
    }
  >
    <ListItem button id="init" key="init" onClick={() => onStepClick('init')}>
      <StepStatusBadge
        stepName="Initializing"
        status={execution.result?.initialization.status}
      />
    </ListItem>

    {execution.signature?.map(element => {
      if (element.children) {
        const childrenList = element.children.map(children => (
          <ListItem
            button
            id={children.ref}
            style={{ paddingLeft: '40px' }}
            key={children.ref}
            onClick={() => {
              onStepClick(children.ref || '');
            }}
          >
            <StepStatusBadge
              stepName={children.name || children.category || 'Undefined'}
              status={execution.result?.steps[children.ref || ''].status}
            />
          </ListItem>
        ));

        return (
          <Fragment key={element.ref}>
            <ListItem
              button
              id={element.ref}
              key={element.ref}
              onClick={() => {
                onStepClick(
                  element.children ? element.children[0].ref || '' : '',
                );
              }}
            >
              <StepStatusBadge
                stepName={element.name || element.category || 'Undefined'}
                status={execution.result?.steps[element.ref || ''].status}
              />
            </ListItem>
            {childrenList}
          </Fragment>
        );
      }

      return (
        <ListItem
          button
          id={element.ref}
          key={element.ref}
          onClick={() => {
            onStepClick(element.ref || '');
          }}
        >
          <StepStatusBadge
            stepName={element.name || element.category || 'Undefined'}
            status={execution.result?.steps[element.ref || ''].status}
          />
        </ListItem>
      );
    })}
  </List>
);
