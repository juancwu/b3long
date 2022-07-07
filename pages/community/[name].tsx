import type { GetServerSideProps, NextPage } from "next";
import * as d3 from "d3";
import { prisma } from "../../lib/prisma";

export interface CommunityPageProps {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

const CommunityPage: NextPage<CommunityPageProps> = ({}) => {
  return <div></div>;
};

export default CommunityPage;
