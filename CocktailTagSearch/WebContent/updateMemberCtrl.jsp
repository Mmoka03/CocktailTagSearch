<%@page import="org.cocktailtagsearch.member.MemberDAO"%>
<%@page import="org.cocktailtagsearch.member.MemberVO"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" session = "false"%>
    
<%
	request.setCharacterEncoding("UTF-8");

	String login_id	= request.getParameter("login_id");
	String name	= request.getParameter("name");
	String pw	= request.getParameter("pw");
	
	MemberVO vo = new MemberVO();
	vo.setLogin_id(login_id);
	vo.setName(name);
	vo.setPassword(pw);
	
	MemberDAO dao = new MemberDAO();
	
	int cnt = dao.updateMember(vo);
	
	if(cnt > 0) {
		out.print("성공");
	} else {
		out.print("실패");
	}
%>