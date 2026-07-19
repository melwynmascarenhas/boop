import { supabase } from "./supabase";

export interface Community {
	id: string;
	name: string;
	description: string;
	created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
	const { data, error } = await supabase
		.from("communities")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	console.log(data);
	return data as Community[];
};
