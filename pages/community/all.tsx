import type { GetServerSideProps, NextPage } from "next";
import * as d3 from "d3";
import { prisma } from "../../lib/prisma";
import Graph from "../../components/graph";

export interface CommunitiesPageProps {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

const CommunitiesPage: NextPage<CommunitiesPageProps> = ({}) => {
  return (
    <div>
      <h1>All Communities</h1>
      <Graph data={[]} dimensions={{width: 0, height: 0}} />
    </div>
  )
};

export default CommunitiesPage;
