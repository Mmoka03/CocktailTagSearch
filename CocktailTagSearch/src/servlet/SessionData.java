package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;

@WebServlet("/SessionData")
public class SessionData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject json = new JSONObject();
		HttpSession session = request.getSession(false);
		if(session == null) {
			json.put("signed", "0");
		} else {
			json.put("signed", "1");
			String name = (String) session.getAttribute("userName");
			String login_id = (String) session.getAttribute("userLogin_id");
			int id = (Integer) session.getAttribute("userId");
			char permission = (char)session.getAttribute("permission");
			
			JSONObject user = new JSONObject();
			user.put("login_id", login_id);
			user.put("id", id);
			user.put("name", name);
			user.put("permission", permission);
			json.put("user", user);
		}
		out.print(json);
		out.close();
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
