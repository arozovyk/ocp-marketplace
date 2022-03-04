open Utils
open Yojson.Safe.Util

let apply_transfer ~currentAddr transfer collections =
  let get_member_string key = member key transfer |> to_string in
  let from = get_member_string "from" in
  let to_field = get_member_string "to" in
  let tokenID = get_member_string "tokenID" in
  let contractAddress = get_member_string "contractAddress" in
  let update_collections collections =
    let col = M.find contractAddress collections in
    if eq_lowercase currentAddr to_field then
      let col = S.add tokenID col in
      M.add contractAddress col collections
    else if eq_lowercase currentAddr from then
      let col = S.remove tokenID col in
      if S.cardinal col = 0 then M.remove currentAddr collections
      else M.add contractAddress col collections
    else collections
  in
  if not (M.exists (fun k _ -> k = contractAddress) collections) then
    let collections = M.add contractAddress S.empty collections in
    update_collections collections
  else update_collections collections

let aggregate_transactions currentAddr result =
  let collections = M.empty in
  let res = filter_member "result" [ result ] |> flatten in
  List.fold_left (fun mp x -> apply_transfer ~currentAddr x mp) collections res
